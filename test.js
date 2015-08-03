module.exports = {

    'Test LOLMentors homepage functionality': function (test) {
        test.open('https://lolmentors.herokuapp.com')
            // navbar items don't have any id/href attached to them
            // fix to test redirection ...
            .assert.title().is('LOLMentors', 'Correct website title')
            .done();

    },

    'Test LOLMentors register page': function (test) {
        test.open('https://lolmentors.herokuapp.com/register')
            // there should be no alerts in the beginning
            .assert.doesntExist('.alert', 'Checking for no alerts')
            // immediately click register -- test for alert to pop up -- asking user to fill in a username
            .click('.btn')
            .assert.exists('.alert-danger', 'Unsuccessful alter pops up')
            .type('#userName', 'samplename2')
            .type('#ingameName', 'sampleingamename2')
            .type('#rank', 'Bronze')
            .type('#position', 'Mid')
            .type('#email', 'sampleemail@email.com')
            .type('#password', 'samplepassword')
            //submit -- check for successful alert and existence of "login now" link
            .click('.btn')
            .assert.exists('.alert-success', 'Success alert pops up')
            .assert.exists('a[href="/login"]', 'Login now link appears')
            .done();
    },

    'Test LOLMentors login page': function (test) {
        test.open('https://lolmentors.herokuapp.com/login')
            .type('#userName', 'samplename2')
            .type('#password', 'samplepassword')
            .click('.btn')
            .wait(2000)
            .assert.url('https://lolmentors.herokuapp.com/home', 'Successful login -- redirect back to home page')
            .done();
    },


    'Test LOLMentors profile page': function (test) {
        test.open('https://lolmentors.herokuapp.com/profile')
            .wait(2000)
            .screenshot('profile1.png')
            .assert.text('.page-header h1').is("samplename2's Profile", "Page header is Player's Profile")
            .assert.attr('.profile-center-block', 'src', 'http://img2.wikia.nocookie.net/__cb20130928162132/leagueoflegends/images/b/b4/BronzeBadgeSeason2.png', 'Player has Bronze icon')
            .assert.attr('.profile-positionpic', 'src', 'http://img2.wikia.nocookie.net/__cb20140607013101/leagueoflegends/images/thumb/2/2b/Mage_icon.jpg/110px-Mage_icon.jpg', 'Player has Mid icon')
            .assert.text('.alert').is('You currently have no mentors or mentees.', 'Player should not have any mentor/mentees at this time')
            .done();
    },

    'Test LOLMentors find mentors page/functionality': function (test) {
        test.open('https://lolmentors.herokuapp.com/find-mentors')
            .assert.text('.page-header h1').is('Find Mentors', 'Page header is Find Mentors')
            .type('#inputCri', 'samplename2')
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by name').click()
            .assert.text('.alert-success p').is('Sorry, none of the users satisfy that criteria.', 'Alert pop up -- player should not find him/herself')
            // function to clear the input box
            .execute(function () {
                document.getElementById('inputCri').value = '';
            })
            .type('#inputCri', 'samplename1')
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by name').click()
            .assert.text('.jumbotron .row .text-center h4').is('samplename1')
            .execute(function () {
                document.getElementById('inputCri').value = '';
            })
            .type('#inputCri', 'Gold')
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by rank').click()
            .wait(2000)
            .assert.attr('.center-block', 'src', 'https://d11y3kg0vwf4zk.cloudfront.net/assets/league/gold_1-fb62f7a2caa3c755b9f15f473d4af897.png', 'Player has Gold icon')
            .execute(function () {
                document.getElementById('inputCri').value = '';
            })
            .type('#inputCri', 'ADC')
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by position').click()
            .wait(2000)
            .assert.attr('.positionpic', 'src', 'http://img1.wikia.nocookie.net/__cb20140607013149/leagueoflegends/images/thumb/0/06/Marksman_icon.jpg/110px-Marksman_icon.jpg', 'Player has ADC icon')
            .execute(function () {
                document.getElementById('inputCri').value = '';
            })
            .type('#inputCri', 'samplename1')
            .assert.attr('.btn', 'value', 'Find', 'Click find button to begin searching for player by name').click()
            .wait(2000)
            .assert.text('.jumbotron .row .text-center h4').is('samplename1')
            .assert.attr('.text-center .btn', 'value', 'Add as Mentor', 'Click Add as Mentor button to add the player as a Mentor').click()
            //switch to profile page and check ....
            .done();
    },

    'Test LOLMentors Post Request page/functionality': function (test) {
        test.open('https://lolmentors.herokuapp.com/posts')
            // to be finished ....
            .done();
    }
};
