from django.http import HttpResponse, JsonResponse
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from functools import wraps
import hashlib, os, binascii, jwt

from voteapp.settings import JWT_USER_SECRET
from users.models import User
from users.serielizers import UserSerializer


#Autherize user
def auth_user(func):
    @wraps(func)
    def inner(request, *args, **kwargs):
        if 'auth_token' in request.COOKIES.keys():
            token = request.COOKIES['auth_token']
            try:
                auth = jwt.decode(token, JWT_USER_SECRET)
                try:
                    user = User.objects.get(id=auth['id'])
                except User.DoesNotExist:
                    return Response('something went wrong', status=status.HTTP_400_BAD_REQUEST)
            except jwt.InvalidSignatureError:
                return Response('something went wrong', status=status.HTTP_400_BAD_REQUEST)
        else:
            return Response('Please login', status=status.HTTP_400_BAD_REQUEST)
        return func(request, user, *args, **kwargs)
    return inner

#Signup user
@api_view(['POST'])
def user_signup_view(request):
    if request.method == 'POST':
        serializer = UserSerializer(data=request.data)
        if serializer.is_valid():
            serializer.save()
            return Response(serializer.data, status=status.HTTP_201_CREATED)
        else:
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#Login user
@api_view(['POST'])
def user_login_view(request):
    if request.method == 'POST':
        try:
            user = User.objects.get(username=request.data.get('username'))
            if verify_password(user.password, request.data.get('password')):
                token = jwt.encode({'id': str(user.id)}, JWT_USER_SECRET).decode('utf-8')
                response = Response('Logged in', status=status.HTTP_202_ACCEPTED)
                response.set_cookie('auth_token', token)
                return response
            else:
                return Response('Incorrect password', status=status.HTTP_400_BAD_REQUEST)
        except User.DoesNotExist:
            return Response('Incorrect username', status=status.HTTP_400_BAD_REQUEST)

#Get user
@api_view(['GET'])
@auth_user
def user_get_view(request, user):
    if request.method == 'GET':
        return Response({
            'username': user.username
        })

#Logout user
@api_view(['POST'])
def user_logout_view(request):
    if request.method == 'POST':
        if 'auth_token' in request.COOKIES.keys():
            response = Response('Logged out', status=status.HTTP_200_OK)
            response.delete_cookie('auth_token')
            return response
        else:
            return Response(status=status.HTTP_404_NOT_FOUND)

#Verify passwords
def verify_password(stored_password, provided_password):
    salt = stored_password[:64]
    stored_password = stored_password[64:]
    pwdhash = hashlib.pbkdf2_hmac('sha512', provided_password.encode('utf-8'), salt.encode('ascii'), 100000)
    pwdhash = binascii.hexlify(pwdhash).decode('ascii')
    return pwdhash == stored_password