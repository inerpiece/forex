USE "1081577"

CREATE TABLE forexRole (
    roleID int IDENTITY(1,1) NOT NULL,
    roleName NVARCHAR(50) NOT NULL,
    roleDescription NVARCHAR(MAX),

    PRIMARY KEY (roleID)
);

CREATE TABLE forexUser (
    userID int IDENTITY(1,1) NOT NULL,
    userEmail NVARCHAR(255) NOT NULL,
    userFirstName NVARCHAR(50) NOT NULL,
    userLastName NVARCHAR(50) NOT NULL,
    userUsername NVARCHAR(50) NOT NULL,
    userPhone int,
    userBirthDay NVARCHAR(50),

    PRIMARY KEY (userID),
);

CREATE TABLE forexPost (
    postID int IDENTITY(1,1) NOT NULL,
    postTitle NVARCHAR(255) NOT NULL,
    postBody NVARCHAR(MAX) NOT NULL,
    postDate NVARCHAR(50),
    FK_userID int NOT NULL,

    PRIMARY KEY (postID),

    CONSTRAINT FK_Post_user FOREIGN KEY (FK_userID) REFERENCES forexUser(userID) --this is referencing the user for each post
);

CREATE TABLE forexComment (
    commentID int IDENTITY(1,1) NOT NULL,
    commentBody NVARCHAR(MAX) NOT NULL,
    commentDate NVARCHAR(50),
    FK_userID int NOT NULL,
    FK_postID int NOT NULL,

    PRIMARY KEY (commentID),

    CONSTRAINT FK_Comment_user FOREIGN KEY (FK_userID) REFERENCES forexUser(userID), --this is referencing the user for each comment
    CONSTRAINT FK_Comment_post FOREIGN KEY (FK_postID) REFERENCES forexPost(postID) --this is referencing the post for each comment
);

CREATE TABLE forexPassword (
    FK_userID int NOT NULL,
    hashPassword NVARCHAR(255) NOT NULL,

    CONSTRAINT FK_forexPassword_user FOREIGN KEY (FK_userID) REFERENCES forexUser(userID), --this is referencing the user for each password
);

/* SELECT
  *
FROM
  SYSOBJECTS
WHERE
  xtype = 'U';
GO */

/* SELECT *
FROM forexUser
INNER JOIN forexPassword
ON forexUser.userID = forexPassword.FK_userID
INNER JOIN forexRole
ON forexRole.roleID = forexUser.FK_roleID
WHERE forexUser.userEmail = @userEmail */

CREATE TABLE forexUserRole (
    FK_userID int NOT NULL,
    FK_roleID int NOT NULL,

    CONSTRAINT FK_UserRole_forexUser FOREIGN KEY (FK_userID) REFERENCES forexUser(userID), --this is referencing the user
    CONSTRAINT FK_UserRole_forexRole FOREIGN KEY (FK_roleID) REFERENCES forexRole(roleID), --this is referencing the role for each user
);

INSERT INTO forexRole (roleName, roleDescription)
VALUES  ('Admin', 'Can do all sorts of shit'),
        ('Mod', 'Can do all sorts of shit but less than an Admin'),
        ('Member', 'Cant do shit')

/*
UPDATE forexUser
SET userEmail = @userEmail,
userFirstName = @userFirstName,
userLastName = @userLastName,
userUsername = @userUsername,
userPhone = @userPhone,
userBirthDay = @userBirthDay,
WHERE userID = @userID

SELECT *
FROM forexRole

INSERT INTO forexUser (userEmail, userFirstName, userLastName, userUsername)
VALUES ('tony@gmail.com', 'Tony', 'Borne', 'toninator')

SELECT *
FROM forexPassword

SELECT userID, roleName, roleID, userEmail
FROM forexUser
INNER JOIN forexUserRole
ON forexUser.userID = forexUserRole.FK_userID
INNER JOIN forexRole
ON forexRole.roleID = forexUserRole.FK_roleID
ORDER BY roleID ASC


SELECT *
FROM forexPost
INNER JOIN forexUser
ON forexPost.FK_userID = forexUser.userID

SELECT *
FROM forexComment
INNER JOIN forexUser
ON forexComment.FK_userID = forexUser.userID
WHERE FK_postID = 12



SELECT *
FROM forexPost

INNER JOIN forexPassword
ON forexPassword.FK_userID = forexUser.userID


INSERT INTO forexUserRole (FK_userID, FK_roleID)
VALUES (1,1)

SELECT userEmail, roleName, userFirstName
FROM forexUserRole
INNER JOIN forexUser
ON forexUser.userID = forexUserRole.FK_userID
INNER JOIN forexRole
ON forexRole.roleID = forexUser.userID


SELECT *
FROM forexPost
INNER JOIN forexUser
ON forexUser.userID = forexPost.FK_userID
INNER JOIN forexComment
ON forexComment.FK_postID = forexPost.postID
WHERE postID = 17


SELECT *
FROM forexComment

INNER JOIN forexUser
ON forexUser.userID = forexComment.FK_userID

INNER JOIN forexPost
ON forexUser.userID = forexPost.FK_userID

*/


/*TEST DATA*/

/*Users*/

INSERT INTO forexUser (userEmail, userFirstName, userLastName, userUsername, userPhone, userBirthDay)
VALUES ('test01@test.com', 'TestUserFN01', 'TestUserLN01', 'user01', 12345678, 'Today'),
        ('test02@test.com', 'TestUserFN02', 'TestUserLN02', 'user02', 12345678, 'Tomorrow'),
        ('testMod@test.com', 'TestMod', 'TestMod', 'Mod01', 12345678, 'Tomorrow'),
        ('testAdmin01@test.com', 'TestAdmin01', 'TestAdmin01', 'admin01', 12345678, 'everyday');

/*Roles for users*/

INSERT INTO forexUserRole (FK_userID, FK_roleID)
VALUES (4, 3),
       (5, 3),
       (6, 2),
       (7, 1)

/*Posts*/

INSERT INTO forexPost (postTitle, postBody, postDate, FK_userID)
VALUES ('This is post title 01', 'post body 01', 'post date 01', 4),
       ('This is post title 02', 'post body 02', 'post date 02', 4),
       ('This is post title 03', 'post body 03', 'post date 03', 5),
       ('This is post title 04', 'post body 04', 'post date 04', 6),
       ('This is post title 05', 'post body 05', 'post date 05', 7),
       ('This is post title 06', 'post body 06', 'post date 06', 7)

/*Comments*/

INSERT INTO forexComment (commentBody, commentDate, FK_userID, FK_postID)
VALUES ('First comment', '21.09.2020', 4, 17),
       ('2nd comment', '21.09.2020', 5, 17),
       ('3rd comment', '21.09.2020', 6, 18),
       ('4th comment', '21.09.2020', 6, 18)