# Project Title
WeatherJam

## 1. Project Description
WeatherJam is an app that warns commuters to avoid roads affected by extreme weather conditions by notifying users  
about the road conditions by using BC live cameras and DriveBC data 

## 2. Names of Contributors
* Wooyong Kim.
* Arcie L.
* Gaganjit Heer
	
## 3. Technologies and Resources Used
List technologies (with version numbers), API's, icons, fonts, images, media or data sources, and other resources that were used.
* HTML, CSS, JavaScript
* Bootstrap 5.0 (Frontend library)
* Firebase 8.0 (BAAS - Backend as a Service)
* DriveBC Open511 API
* Sweet Alert 2.0
* Mapbox 11.0

## 4. Complete setup/installion/usage
State what a user needs to do when they come to your project.  How do others start using your code or application?
Here are the steps ...
* The user must first sign up be entering their email, name and creating a password.
* The user will be redirected to the home page after logging in. The user will not have any Favourite routes added yet
  so they can go to the Route List or Map View to see routes and add them to their Favourites for easy access in the 
  future.
* The user can go to a specific route by clicking View Live Cam and click play and use the slider on the video to view traffic
  footage.
* The user can read about traffic incidents that are occurring by scrolling down on a specific route page.
* The user can also click on the Notifications at the top and click on a specific notification to be taken to that page.

## 5. Known Bugs and Limitations
Here are some known bugs:
* Live cam video source has set dimensions that result in horizontal scrollbar appearing in mobile view

## 6. Features for Future
What we'd like to build in the future:
* Alert to remind users to change their tires to snow tires in advance based on weather predictions.
* Allow users to clear notifications after they have been viewed.
* Weather feature to display the weather based on the user's location.
	
## 7. Contents of Folder
Content of the project folder:

```
 Top level of project folder: 
├── .gitignore               # Git ignore file
├── index.html               # landing HTML file, this is what users see when you come to url
└── README.md
├── developers.html          # information about developers of the app
├── eachRoute.html           # template for each route's page, includes live cam and events descriptions
├── feedback.html            # feedback form for user's to report a bug
├── help.html                # help page describes how to use certain features in the app
├── home.html                # what users see when they login, displays their favourite routes
├── login.html               # where user enters login information to access the app
├── map.html                 # map view of the routes' live cams, user can click a route to go to that route page
├── profile.html             # user can edit their name, city and form of transportation
├── routelist.html           # list of all routes, routes with an incident are displayed at the top
├── thanks.html              # thanks the user for submitting feedback, user redirected here after submitting feedback

It has the following subfolders and files:
├── .git                     # Folder for git repo
├── images                   # Folder for images
    /alertimage.png          # inipagi on Freepik
    /arcie.png               # getavataaars.com
    /favouritesimage.jpg     # inipagi on Freepik
    /gagan.png               # getavataaars.com
    /helppage1.png           # WeatherJam
    /helppage2.png           # WeatherJam
    /helppage3.png           # WeatherJam
    /mapviewimage.jpg        # inipagi on Freepik
    /noel.png                # getavataaars.com
    /videoimage.jpg          # inipagi on Freepik
├── scripts                  # Folder for scripts
    /authentication.js       # User authentication, signs up/signs in user
    /eachRoute.js            # Parses data and displays route info on eachRoute.html
    /favourites.js           # Adds/removes favourite routes for user and creates notifications for favourites
    /feedback.js             # Creates feedback document for logged in user
    /main.js                 # Displays user name, favourites and four randomly selected routes on home.html
    /map.js                  # Displays route live cam locations on map.html
    /profile.js              # Functions to allow user to edit personal information
    /routelist.js            # Functions to parse route data and display routes organized by incidents at top of routelist.html
    /searchRoute.js          # Function for search bar to filter routes on routelist.html
    /skeleton.js             # Loads navbar and footer skeletons to each html page
├── styles                   # Folder for styles
    /devStyle.css            # Styling for developers.html
    /indexstyle.css          # Styling for index.html
    /login.css               # Styling for login.html
    /map.css                 # Styling for map.html
    /style.css               # Styling for all html pages
├── text                     # Folder for text
    /footer.html             # Footer for each html page
    /nav.html                # Navbar for each html page




```


