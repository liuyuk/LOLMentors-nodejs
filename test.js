/*** PLEASE CHANGE THE USERNAME VARIABLE EACH TIME THE TEST IS RUN -- ADD 1 TO THE CURRENT COUNT OF SAMPLENAME ***/
var username = "samplename7";

module.exports = {

    'Test LOLMentors homepage functionality': function (test) {
        test.open('https://lolmentors.herokuapp.com')
            // test navigation bar elements -- correct redirect to pages on click
            .assert.title().is('LOLMentors', 'Correct website title')
            .assert.text('li:nth-child(1) a').is('Register', 'Exists register button on navigation bar -- click').click()
            .assert.url('https://lolmentors.herokuapp.com/register', 'Successful redirect to register page')
            .wait(2000)
            .assert.text('li:nth-child(2) a').is('Login', 'Exists login button on navigation bar -- click').click()
            .wait(2000)
            .assert.url('https://lolmentors.herokuapp.com/login', 'Successful redirect to login page')
            .assert.text('.navbar-brand').is('LOLMentors', 'Exists LOLMentors home button on navigation bar -- click').click()
            .assert.url('https://lolmentors.herokuapp.com/home', 'Successful redirect back to home page')
            .done();

    },

    'Test LOLMentors register page': function (test) {
        test.open('https://lolmentors.herokuapp.com/register')
            .assert.text('.page-header h1').is('Register', 'Page header is Register')
            // there should be no alerts in the beginning -- have not submitted
            .assert.doesntExist('.alert', 'Checking for no alerts')
            // immediately click register -- test for alert to pop up -- asking user to fill in a username
            .click('.btn')
            .assert.text('.alert-danger').is('Please fill in your username.', 'Unsuccessful alert pops up -- ask to fill in username')
            .type('#userName', username)
            .type('#ingameName', 'sampleingamename2')
            .type('#email', 'sampleemail@email.com')
            .type('#password', 'samplepassword')
            // check for user entering an invalid rank name -- input an invalid name
            .type('#rank', 'randomrank')
            .click('.btn')
            .assert.exists('.alert-danger', 'Alert pop up -- indicating invalid rank')
            // enter valid rank
            .execute(function () { //function to clear the input box -- DalekJS  by default appends to the input box
                document.getElementById('rank').value = '';
            })
            .type('#rank', 'Bronze')
            // check for user entering an invalid position name -- input an invalid positob
            .type('#position', 'randomposition')
            .click('btn')
            .assert.exists('.alert-danger', 'Alert pop up -- indicating invalid position')
            .execute(function () {
                document.getElementById('position').value = '';
            })
            .type('#position', 'Mid')
            //submit -- check for successful registration alert with a "login now" link
            .click('.btn')
            .assert.exists('.alert-success', 'Success alert pops up')
            .assert.exists('a[href="/login"]', 'Login now link appears')
            .done();
    },

    'Test LOLMentors login page': function (test) {
        test.open('https://lolmentors.herokuapp.com/login')
            .assert.text('.page-header h1').is('Login', 'Page header is Login')
            //check for unsuccessful login -- use an incorrect username/password
            .type('#userName', 'invalidusername')
            .type('#password', 'invalidpassword')
            .click('.btn')
            .assert.text('.alert-danger').is('Wrong username or password', 'Unsuccessful alert pops up -- wrong username/password')
            .execute(function () {
                document.getElementById('userName').value = '';
            })
            .execute(function () {
                document.getElementById('password').value = '';
            })
            //check for successful login -- use correct username/password
            .type('#userName', username)
            .type('#password', 'samplepassword')
            .click('.btn')
            .wait(2000)
            // check that user is redirected back to the homepage based on successful login
            .assert.url('https://lolmentors.herokuapp.com/home', 'Successful login -- redirect back to home page')
            .done();
    },


    'Test LOLMentors profile page': function (test) {
        test.open('https://lolmentors.herokuapp.com/profile')
            .assert.text('.page-header h1').is(username + "'s Profile", "Page header is Player's Profile")
            // check the user has correct profile pictures based on rank/position
            .assert.attr('.profile-center-block', 'src', 'http://img2.wikia.nocookie.net/__cb20130928162132/leagueoflegends/images/b/b4/BronzeBadgeSeason2.png', 'Player has Bronze icon')
            .assert.attr('.profile-positionpic', 'src', 'http://img2.wikia.nocookie.net/__cb20140607013101/leagueoflegends/images/thumb/2/2b/Mage_icon.jpg/110px-Mage_icon.jpg', 'Player has Mid icon')
            // check that the user does not have any mentors/mentees as the player has not added any yet
            .assert.text('.alert').is('You currently have no mentors or mentees.', 'Player should not have any mentor/mentees at this time')
            .done();
    },

    'Test LOLMentors find mentors page/functionality': function (test) {
        test.open('https://lolmentors.herokuapp.com/find-mentors')
            .assert.text('.page-header h1').is('Find Mentors', 'Page header is Find Mentors')
            // find yourself -- result should be empty as you cannot add yourself as a mentor
            .type('#inputCri', username)
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by name').click()
            .assert.text('.alert-success p').is('Sorry, none of the users satisfy that criteria.', 'Alert pop up -- player should not find him/herself')
            .execute(function () {
                document.getElementById('inputCri').value = '';
            })
            // find an existing player by name
            .type('#inputCri', 'samplename1')
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by name -- using samplename1').click()
            .assert.text('.jumbotron .row .text-center h4').is('samplename1', 'Successfully found player -- samplename1')
            .execute(function () {
                document.getElementById('inputCri').value = '';
            })
            // find an existing player by rank
            .type('#inputCri', 'Gold')
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by rank').click()
            .wait(2000)
            .assert.attr('.center-block', 'src', 'https://d11y3kg0vwf4zk.cloudfront.net/assets/league/gold_1-fb62f7a2caa3c755b9f15f473d4af897.png', 'Searched Players has Gold icon')
            .execute(function () {
                document.getElementById('inputCri').value = '';
            })
            //find an existing player by position
            .type('#inputCri', 'ADC')
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by position').click()
            .wait(2000)
            .assert.attr('.positionpic', 'src', 'http://img1.wikia.nocookie.net/__cb20140607013149/leagueoflegends/images/thumb/0/06/Marksman_icon.jpg/110px-Marksman_icon.jpg', 'Searched players has ADC icon')
            .execute(function () {
                document.getElementById('inputCri').value = '';
            })
            // add a user (samplename1) as a user
            .type('#inputCri', 'samplename1')
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by name').click()
            .wait(2000)
            .assert.text('.jumbotron .row .text-center h4').is('samplename1', 'result has player name')
            .assert.attr('.jumbotron .btn', 'value', 'Add as Mentor', 'Click Add as Mentor button to add the player as a Mentor').click()
            .wait(2000)
            .assert.exists('.alert-success', 'Alert pop up indicating successful add')
            //switch to profile page and check if player is added
            .assert.text('li:nth-child(1) a').is('Profile', 'Exists Profile button on navigation bar -- click').click()
            .wait(2000)
            .assert.text('.jumbotron h4').is('samplename1', 'Player has been added as a Mentor and is now on the mentor list')
            .done();
    },

    'Test LOLMentors Post Request page/functionality': function (test) {
        test.open('https://lolmentors.herokuapp.com/posts')
            .assert.text('.page-header h1').is('Post a Request', 'Page header is Post a Request')
            //fill in a new request
            .type('textarea:nth-child(3)', 'newtitle')
            .type('textarea:nth-child(5)', 'Mentor')
            .type('textarea:nth-child(7)', 'automatic test -- executed by test.js')
            .click('.form-horizontal .btn')
            .wait(2000)
            // check the post
            .open('https://lolmentors.herokuapp.com/posts') //reload
            .wait(2000)
            .assert.text('.jumbotron p').is('By: ' + username, 'Post exists -- sumbitted by' + username)
            .done();
    }
};
