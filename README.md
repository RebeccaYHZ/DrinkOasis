# DrinkOasis

DrinkOasis emerges as a digital guide for cocktail enthusiasts. By connecting users with nearby cocktail bars and offering genuine reviews, we intend to elevate the art of cocktail-making and celebrate the establishments that perfect it. Moreover, this website implements a diary-like function, allowing users to share their experience while making drinks on their own. 

**DrinOasis Website Link**
[DrinkOasis Website Link](https://drinkoasisv2.onrender.com/)

## Author

**Xiangyue Zhang**  
[Xiangyue Zhang's personal website](https://rebeccazzha.github.io/)

**Yahui Zhang**  
[Yahui Zhang's personal website](https://rebeccayhz.github.io/Welcome-to-know-me/)

Class Link: [Web Development Fall 2023](https://johnguerra.co/classes/webDevelopment_fall_2023/)

## Design Documents

**Improvement Plan**
[Improvement Plan](https://docs.google.com/document/d/10Jnv5J87FlGdX1pgOJYjYwuSxs-AQHQ1Out3IFNADDw/edit?usp=sharing)

**Presentation slides**
[Presentation slides](https://www.canva.com/design/DAF25scYCJg/cMvxYkyqhQUqlXY_phWJ0w/edit?utm_content=DAF25scYCJg&utm_campaign=designshare&utm_medium=link2&utm_source=sharebutton)

**Youtube Video**
[Youtube Video](https://youtu.be/fp8-8meX0u4)

**Usibility Report**
[Usibility Report](https://docs.google.com/document/d/1UUBbzTh7xV7fRkgyU8loDR8INncQGhLTn0fqeT7g42M/edit?usp=sharing)

## Project Functionalities

1. **Homepage**  
   ![Homepage image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/homepage.png)
   
2. **Users Sign Up and Login**
   ![Login page image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/login.png)
   ![Signup page image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/registeration.png)

3. **Post, Delete, and Edit Diaries**  
   Once logged in, users can post diaries documenting their home-made cocktail making diaries and their experiences when making drinks, and they can only delete or edit their own posts.
   ![Diaries page image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/diaries.png)
   ![Diaries post image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/postdiary.png)
   ![Diaries edit image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/editdiary.png)

4. **View Diaries**  
   Users’ diaries are only viewable after entering someone’s profile. Therefore, posts about bars will show the author, and clicking on the author will direct users to the author’s profile.
   ![View diaries image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/otherdiary.png)

5. **Post, Read, Update, and Delete Bar Reviews**  
   Users can also post reviews about local bars. Although users can only delete or edit their own post, this page will be accessible to all users for exploring interesting bars.
   ![Review(not log in) page image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/reviewnotlogin.png)
   ![Review(log in) page image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/reviews.png)
   ![Review post image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/postreview.png)
   ![Review edit image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/editreview.png)


## Color Palette & Fonts
![Color Palette & Fonts image](https://github.com/RebeccaYHZ/DrinkOasis/blob/Revised-Usability/vite-project/src/assets/img/Screenshot%202023-12-13%20at%201.22.51%20PM.png)

## Lighthouse Justification
1. Best Practices -- 
   Browser errors were logged to the console on review page:
   Because we want users to be able to view all reviews even though they are not logged in, and not logged in users have a 401 status
2. SEO -- 
   robot.txt is correctly added in the root folder of front-end code but isn't properly accessed due to the way the "build" command is set up in vite


## Setup and Usage

1. Clone the repository or download the source code.
2. npm install
3. npm start


## Instruction to build

**Clone the Repository:**
git clone https://github.com/RebeccaYHZ/DrinkOasis/tree/Revised-Usability

**Enter the Project Directory:**
cd DrinkOasis

**Install Dependencies:**
Install the necessary dependencies using npm.
npm install

**Environment Configuration:**
Create a .env file in the root of your project. Populate it with essential configurations. 

**Boot up MongoDB:**
Start the MongoDB server.

**Run the App:**
Use npm to initiate the server.
npm start


