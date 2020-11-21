from django.db import models
import uuid

from users.models import User

class Survey(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=100)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    created_at = models.DateTimeField(auto_now_add=True)

    class Meta:
        ordering = ['-created_at']

    def __str__(self):
        return self.title

class SurveyChoice(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    title = models.CharField(max_length=100)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE, null=True)
    votes = models.PositiveIntegerField(default=0)

    def __str__(self):
        return self.title

class SurveyVote(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    choice = models.ForeignKey(SurveyChoice, on_delete=models.CASCADE, null=True)
    survey = models.ForeignKey(Survey, on_delete=models.CASCADE)

    def __str__(self):
        return self.user.username