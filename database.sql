CREATE TABLE Users (
    userId INT PRIMARY KEY AUTO_INCREMENT,
    email VARCHAR(255) UNIQUE NOT NULL
);

CREATE TABLE UserProgress (
    progressId INT PRIMARY KEY AUTO_INCREMENT,
    userId INT,
    wpm INT NOT NULL,
    accuracy INT NOT NULL,
    rawSpeed INT NOT NULL,
    date DATETIME NOT NULL,
    FOREIGN KEY (userId) REFERENCES Users(userId)
);