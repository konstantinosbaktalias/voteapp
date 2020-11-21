from django.db import models
import hashlib, os, binascii, uuid

#Custom user model
class User(models.Model):
    id = models.UUIDField(primary_key=True, default=uuid.uuid4, editable=False)
    username = models.CharField(max_length=35, unique=True)
    password = models.CharField(max_length=512)

    def save(self, *args, **kwargs):
        self.password = hash_password(self.password)
        super().save(*args, **kwargs)

    def __str__(self):
        return self.username

#Hash passwords
def hash_password(password):
    salt = hashlib.sha256(os.urandom(60)).hexdigest().encode('ascii')
    pwdhash = hashlib.pbkdf2_hmac('sha512', password.encode('utf-8'), salt, 100000)
    pwdhash = binascii.hexlify(pwdhash)
    return (salt + pwdhash).decode('ascii')