from rest_framework import serializers

from users.models import User

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['username', 'password']
    
    def get_queryset(self):
        username = self.request.query_params.get('username')
        queryset = User.objects.get(username=username)
        return queryset