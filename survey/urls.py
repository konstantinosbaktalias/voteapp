from django.urls import path

from survey.apiviews import (
    get_all_surveys_view,
    get_survey_view,
    get_user_surveys_view,
    download_survey_view,
    create_survey_view,
    delete_survey_view, 
    create_choice_view,
    delete_choice_view,
    get_vote_view, 
    create_vote_view,
    delete_vote_view
)

urlpatterns = [
    path('survey/page/<int:number>', get_all_surveys_view),
    path('dashboard/', get_user_surveys_view),
    path('survey/<str:pk>', get_survey_view),
    path('create/survey/', create_survey_view),
    path('survey/download/<str:pk>', download_survey_view),
    path('survey/delete/<str:pk>', delete_survey_view),
    path('survey/choice/create/<str:pk>', create_choice_view),
    path('survey/choice/delete/<str:pk>', delete_choice_view),
    path('survey/vote/<str:pk>', get_vote_view),
    path('survey/choice/create/vote/<str:pk>', create_vote_view),
    path('survey/choice/delete/vote/<str:vote_pk>', delete_vote_view),
]