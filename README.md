The Github repository is a project for a social media platform that offers functionalities similar to Twitter. Users can like and retweet posts, as well as post gifs and up to four pictures. The comment section is still under development.

Users can view their timeline, which is populated by their own posts and the posts of their followers. They can follow other users, access their profiles, and navigate through their posts. Users can also send direct messages to each other.

The project uses Azure Storage to store pictures and Redis for handling likes and retweets. It is a small microservice architecture, with the main service handling most of the logic. The hydrate service populates the user's timeline and the fanout service charges on uploading posts.

The project uses Typescript and React for the front-end and Node.js and Express for the back-end. The database is MySQL and Redis. Sockets for DMs. JWT for Authentication and Authorization.


#Profile (My Profile)
https://user-images.githubusercontent.com/89571043/221203539-0399982d-ad90-4876-858e-bc87f4728951.png

#Profile (Other user's Profile)
![Screenshot from 2023-02-24 14-57-11](![Screenshot from 2023-02-24 14-57-43](https://user-images.githubusercontent.com/89571043/221203554-35d86800-b763-42bb-a902-130d007e3b1a.png))

#Uploading pictures
![Screenshot from 2023-02-24 14-59-32](https://user-images.githubusercontent.com/89571043/221203611-bec3668d-0854-41e0-8ebd-c42cddc3d882.png)
![Screenshot from 2023-02-24 14-59-37](https://user-images.githubusercontent.com/89571043/221203624-f1a32de5-8945-4871-b681-dea415767041.png)
![Screenshot from 2023-02-24 14-59-46](https://user-images.githubusercontent.com/89571043/221203634-c2c631dd-17e6-452e-9a0c-c460dbfcdb24.png)
![Screenshot from 2023-02-24 14-59-56](https://user-images.githubusercontent.com/89571043/221203643-27aac1ad-65e1-4d75-a049-68089a61abea.png)
## error while trying to upload more than 4 pictures
![Screenshot from 2023-02-24 14-58-34](https://user-images.githubusercontent.com/89571043/221203607-7f36672b-ba48-4446-899e-61bc9e8d3414.png))

#Uploading Gif
![Screenshot from 2023-02-24 15-00-07](https://user-images.githubusercontent.com/89571043/221203645-8f2b85f2-0ca6-4d34-8658-cb0f6843971f.png)

#User's DMs
![Screenshot from 2023-02-24 15-12-27](https://user-images.githubusercontent.com/89571043/221203650-b9688511-ea3d-4fa1-8f56-42fafee73e0c.png)

#Dm a User
![Screenshot from 2023-02-24 15-12-42](https://user-images.githubusercontent.com/89571043/221203654-4307f3be-368a-497d-aa47-83950b10deb9.png)
