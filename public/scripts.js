

const clickMe = () => {
    alert("Go to Coles and buy me, Thanks!")
}
$(document).ready(function () {
    $('#myButoon').click(() => {
        clickMe();
    })
    $('#myButoon2').click(() => {
        clickMe();
    })
    $("button").click(function () {
        $.ajax({
            url: "addTwoNumber", success: function (result) {
                $("#div1").html(result);
            }
        });
    });
    $('#contactForm').on('submit', function (event) {
        event.preventDefault();
        const formData = {
            name: $('#name').val(),
            email: $('#email').val(),
            message: $('#message').val()
        };

        $.ajax({
            type: 'POST',
            url: '/contact',
            data: JSON.stringify(formData),
            contentType: 'application/json',
            success: function (response) {
                alert('Your Contact saved successfully!');
                $('#contactForm')[0].reset();
            },
            error: function (error) {
                alert('Error in saving contact: ' + error.responseText);
            }
        });
    });

});
let socket = io();
socket.on('number', (msg) => {
    console.log('Random Number: ' + msg);
});


