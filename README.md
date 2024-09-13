# jobstreet-feeding-data

Requirements:
- PostgreSQL 13 or above
- Python
- NodeJS
- Postman

How to setup project:
1. Create a new database in postgreSQL named "jobstreet"
2. Right click on PostgreSQL and select Connection tab to see your database config:

![image](https://github.com/user-attachments/assets/ae466e00-35fa-4f90-8a82-99eac9c238d8)

3. Clone this repository
4. Backend Setup

   2a. Go to be_django folder (cd be_django)

   2b. Run command "python -m venv .venv" to create virtual environemnt

   2c. Run command "pip install -r requirements.txt" to install scripts and libraries

   2d. Open settings.py and configure database using your postgreSQL configurations

   ![image](https://github.com/user-attachments/assets/c8d257d5-1a1a-4072-9a27-4367650b3ac8)

   2e. Run command "python manage.py migrate" to migrate main app

   2f. Run command "python manage.py makemigrations api" to make migrations for api folder, which contains model and main APIs 

   2g. Run command "pythin manage.py migrate api" to migrate api folder

   2h. Run command "python manage.py runserver" to run the server

5. Using API in Postman
   ![image](https://github.com/user-attachments/assets/6827fadf-c626-4695-8901-36ff5ea1fb42)

   ![image](https://github.com/user-attachments/assets/6d56198b-1d40-412a-89a3-d380901dc3f5)

   ![image](https://github.com/user-attachments/assets/9e0b8ec3-4c21-44f5-9a1f-6ab63b57e45a)

   ![image](https://github.com/user-attachments/assets/fdff55f2-0a99-49fa-8aba-627c292227da)

   ![image](https://github.com/user-attachments/assets/f585bf50-8482-4def-823c-5e7fdfe6fb2e)

   ![image](https://github.com/user-attachments/assets/f871b003-0b93-43e4-bc7f-250b952cd5b0)

6. Frontend Setup

   6a. Go to fe-nextjs project folder (cd fe-nextjs)

   6b. run command "npm install" to install dependencies

   6c. run command "npm run dev" to start the app and open the web app

   ![image](https://github.com/user-attachments/assets/85d73abe-4672-4d23-8af4-9e6ac80eba3b)

BE Unit Tests results:
vai run pytest
![image](https://github.com/user-attachments/assets/77587881-4e13-46f9-8303-167183c3e837)

FE Unit Tests results:
via run "npm test"
![image](https://github.com/user-attachments/assets/a2cd64a4-8e3b-453a-b48c-810490c9c321)


