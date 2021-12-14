# [Notea] Wiki

This is the wiki for my Notea project. This is my first project with Ionic and Capacitor so, it may contents many errors and the code is not clean, but i'll update this project in the future, due to the project delivery date.

The structure of the repository is as shown below:

| Topic                                                 | Description                                                  |
| ----------------------------------------------------- | ------------------------------------------------------------ |
| [Development Process](./03-development-process)       | Documents related to software development process            |
| [Architecture](./04-architecture)                     | Documents related to software architecture                   |
| [Code Review Process](./06-code-review-process)       | Documents related to code review process, definition of ready/done |
| [Release and Deployment](./08-release-and-deployment) | Documents related to release and deployment                  |
| [User Manual](./08-release-and-deployment)            | Documents related to the user Manual                         |




# User Manual

## Login Page

In the **login page**, the user can choose two ways of Sing In, using the Google Authentication, or by register in the App, this method can be access clicking the *"¿No tienes cuenta?"* button. This method will register the user in the firebase database and allow to enter the App. In that moment, the App can't recover the password.

![Releases section in right-hand sidebar](https://cdn.discordapp.com/attachments/770910118673121300/920403976002875402/unknown.png)

## Notes Screen

In this screen we can see all the notes that the user have in the database storage, this notes will load by pages of 15 notes of length, the user can scroll downwards to load more notes.

![center](https://cdn.discordapp.com/attachments/770910118673121300/920404026967867412/unknown.png)

The user can edit and listen to the note by sliding the note to the right, it will show the next image:

![center](https://cdn.discordapp.com/attachments/770910118673121300/920404080973721690/unknown.png)

By clickin in the edit button, it will show the next image:

![alt](https://cdn.discordapp.com/attachments/770910118673121300/920404728003829800/unknown.png)

The note will be loaded in the fields and the user can use the speechRecognition functionality by clickin in the microphone button, it will allow the user to speak and the App will recognize the voice by clickin in the mute button.
The last button will read the note with the Text-To-Speech plugin.


The user can delete the note by sliding the note to the left, it will show the next image:

![alt](https://cdn.discordapp.com/attachments/770910118673121300/920404139777880064/unknown.png)

by clickin in the delete button, it will send the user a message for a confirmation to take effect.

In the **Add Note page**, the user can add a new note to their Storage in Firebase.
The user can use the speechRecognition functionality by clickin in the microphone button, it will allow the user to speak and the App will recognize the voice by clickin in the mute button.

![alt](https://cdn.discordapp.com/attachments/770910118673121300/920408297750822932/unknown.png)

In the **Profile Page** the user can see their total notes, the notes that the user has created and deleted in their devices and if the user has login without the Google Authentication, they are allow to take a picture to update their profiles.

![Profile Page](https://cdn.discordapp.com/attachments/770910118673121300/920404319403122708/unknown.png)

In this page the user can also slide a lateral menu to change the language or logout.

![alt](https://cdn.discordapp.com/attachments/770910118673121300/920404389397680218/unknown.png)



