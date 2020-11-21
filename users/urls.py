from django.urls import path

from users.apiviews import user_get_view, user_signup_view, user_login_view, user_logout_view

urlpatterns = [
    path('user/', user_get_view),
    path('user/signup/', user_signup_view),
    path('user/login/', user_login_view),
    path('user/logout/', user_logout_view),
]