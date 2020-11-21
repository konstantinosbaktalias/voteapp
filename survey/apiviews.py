from django.shortcuts import get_object_or_404
from django.http import HttpResponseRedirect
from django.core.paginator import Paginator
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
import pandas as pd
import uuid

from survey.models import Survey, SurveyChoice, SurveyVote
from users.apiviews import auth_user

#Get all surveys
@api_view(['GET'])
def get_all_surveys_view(request, number):
    if request.method == 'GET':
        surveys = Survey.objects.all()
        paginator = Paginator(surveys, 8) 
        paginated_surveys = paginator.get_page(number=number)
        surveys_list = []
        for survey in paginated_surveys:
            surveys_list.append({
                'id': survey.id, 
                'title': survey.title, 
                'user': survey.user.username, 
                'created_at': survey.created_at
            })
        return Response({
            'surveys': surveys_list,
            'page_number': paginated_surveys.number,
            'next': number+1,
            'previous': number-1,
            'total_pages': paginated_surveys.paginator.num_pages
        })


#Get user's surveys
@api_view(['GET'])
@auth_user
def get_user_surveys_view(request, user):
    if request.method == 'GET':
        surveys = Survey.objects.filter(user=user)
        surveys_list = []
        for survey in surveys:
            surveys_list.append({
                'id': survey.id, 
                'title': survey.title, 
                'user': survey.user.username, 
                'created_at': survey.created_at
            })
        return Response({
            'surveys': surveys_list,
            'user': user.username
        })

#Get survey
@api_view(['GET'])
def get_survey_view(request, pk):
    if request.method == 'GET':
        survey = get_object_or_404(Survey, id=pk)
        survey_choices = SurveyChoice.objects.filter(survey=survey)
        choices_list = []
        df = pd.DataFrame(columns=['labels', 'votes'])
        for choice in survey_choices:
            choices_list.append({
                'id': choice.id,
                'title': choice.title
            })
            df.loc[choice] = [choice.title] + [choice.votes]
        return Response({
            'id': survey.id,
            'title': survey.title,
            'choices': choices_list,
            'user': survey.user.username,
            'results': df
        })

#Download survey
@api_view(['GET'])
def download_survey_view(request, pk):
    if request.method == 'GET':
        survey = get_object_or_404(Survey, id=pk)
        survey_choices = SurveyChoice.objects.filter(survey=survey)
        df = pd.DataFrame(columns=['labels', 'votes'])
        for choice in survey_choices:
            df.loc[choice] = [choice.title] + [choice.votes]
        csv = df.to_csv(f'media/csv/{survey.id}.csv')
        return HttpResponseRedirect(f'../../media/csv/{survey.id}.csv')

#Create survey
@api_view(['POST'])
@auth_user
def create_survey_view(request, user):
    if request.method == 'POST':
        survey = Survey.objects.create(
            title=request.data.get('title'),
            user=user
        )
        try:
            survey.save()
            return Response(status=status.HTTP_201_CREATED)
        except Exception:
            return Response(status=status.HTTP_400_BAD_REQUEST)

#Delete survey
@api_view(['DELETE'])
@auth_user
def delete_survey_view(request, user, pk):
    if request.method == 'DELETE':
        survey = get_object_or_404(Survey, id=pk)
        if user == survey.user:
            survey.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

#Create choice
@api_view(['POST'])
@auth_user
def create_choice_view(request, user, pk):
    if request.method == 'POST':
        survey = get_object_or_404(Survey, id=pk)
        if survey.user == user:
            try: 
                SurveyChoice.objects.get(survey=survey, title=request.data.get('title'))
            except SurveyChoice.DoesNotExist:
                survey_choice = SurveyChoice.objects.create(
                title=request.data.get('title'),
                survey=survey
                )
                survey_choice.save()
                return Response(status=status.HTTP_201_CREATED)
            return Response('This choice already exists', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

#Delete choice
@api_view(['DELETE'])
@auth_user
def delete_choice_view(request, user, pk):
    if request.method == 'DELETE':
        choice = get_object_or_404(SurveyChoice, id=pk)
        if user == choice.survey.user:
            choice.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)

#Create vote
@api_view(['POST'])
@auth_user
def create_vote_view(request, user, pk):
    if request.method == 'POST':
        survey = get_object_or_404(Survey, id=pk)
        survey_choice = get_object_or_404(SurveyChoice, id=uuid.UUID(request.data.get('choice')).hex)
        try:
            SurveyVote.objects.get(survey=survey, user=user)
        except SurveyVote.DoesNotExist:
            vote = SurveyVote.objects.create(
            survey=survey,
            user=user,
            choice=survey_choice
            )   
            vote.save()
            survey_choice.votes += 1
            survey_choice.save()
            return Response(status=status.HTTP_201_CREATED)
        return Response('You have already vote', status=status.HTTP_400_BAD_REQUEST)

#Get vote
@api_view(['GET'])
@auth_user
def get_vote_view(request, user, pk):
    if request.method == 'GET':
        survey = get_object_or_404(Survey, id=pk)
        try:
            vote = SurveyVote.objects.get(survey=survey, user=user)
        except SurveyVote.DoesNotExist:
            return Response(status=status.HTTP_404_NOT_FOUND)
        return Response({
            'id': vote.id,
            'choice': vote.choice.title 
        })

#Delete vote
@api_view(['DELETE'])
@auth_user
def delete_vote_view(request, user, vote_pk):
    if request.method == 'DELETE':
        vote = get_object_or_404(SurveyVote, id=vote_pk)
        if user == vote.user:
            vote.choice.votes -= 1
            vote.choice.save()
            vote.delete()
            return Response(status=status.HTTP_200_OK)
        else:
            return Response(status=status.HTTP_401_UNAUTHORIZED)