from django.contrib import admin

from survey.models import Survey, SurveyChoice, SurveyVote

admin.site.register(Survey)
admin.site.register(SurveyChoice)
admin.site.register(SurveyVote)