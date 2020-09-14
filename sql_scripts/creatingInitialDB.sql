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

SELECT *
FROM forexRole

INSERT INTO forexUser (userEmail, userFirstName, userLastName, userUsername)
VALUES ('tony@gmail.com', 'Tony', 'Borne', 'toninator')

SELECT *
FROM forexUser

INSERT INTO forexUserRole (FK_userID, FK_roleID)
VALUES (1,1)

SELECT userEmail, roleName, userFirstName
FROM forexUserRole
INNER JOIN forexUser
ON forexUser.userID = forexUserRole.FK_userID
INNER JOIN forexRole
ON forexRole.roleID = forexUser.userID

