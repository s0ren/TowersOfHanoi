/***********************************************************************************************************************

 Copyright (c) 2016 by Søren Magnusson

 Published under The MIT Licence (MIT)

 Permission is hereby granted, free of charge, to any person obtaining a copy of this software and
 associated documentation files (the "Software"), to deal in the Software without restriction,
 including without limitation the rights to use, copy, modify, merge, publish, distribute, sublicense,
 and/or sell copies of the Software, and to permit persons to whom the Software is furnished to do so,
 subject to the following conditions:

 The above copyright notice and this permission notice shall be included in all copies
 or substantial portions of the Software.

 THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED,
 INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT.
 IN NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
 WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE
 OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.

 https://opensource.org/licenses/MIT

 **********************************************************************************************************************/


/**
 *
 * @type {{pins: (any), stacks: {left: Array, center: Array, right: Array}, numberOfDiscs: number}}
 */
var gameWorld = {
    pins    : $('.hanoi-pin'),
    stacks  : {
        left: [],
        center: [],
        right: []
    },
    numberOfDiscs: 6
};

/**
 *
 * @param gameWorld
 */
function startGame(gameWorld)
{
    gameWorld.stacks = {
        //left: [1,2,3,4,5,6],
        left: _.range(1, gameWorld.numberOfDiscs + 1),
        center: [],
        right: []
    };
    draw(gameWorld);
}

/**
 *  function moveDisc
 *      move a "disc" from one pin array in gameworld, to another pin array in gameworld.
 *
 * @param fromStackId
 * @param toStackId
 * @param gameWorld
 */
function moveDisc(fromStackId, toStackId, gameWorld)
{

}

/**
 * function isValidMove
 *      valid moves are smaller discs on bigger ones, every disc is valid on empty pins
 * @param fromStackId
 * @param toStackId
 * @param gameWorld
 * @returns {boolean} treu if move is valid, false if no
 */
function isValidMove(fromStackId, toStackId, gameWorld)
{

}

/**
 * function checkWin
 *      The gaem is won if all discs are stacked properly on the rigth pin
 *
 * @param gameWorld
 * @returns {boolean}
 */
function checkWin(gameWorld)
{
    var rigthStack = gameWorld.stacks['right'];

}

/**
 *
 * @param gameWorld
 */
function draw(gameWorld)
{
    for(var stackName in gameWorld.stacks)
    {
        console.log("Håndterer " + stackName);
        var stack = gameWorld.stacks[stackName];
        var pin = gameWorld.pins.filter('#'+stackName);

        // tøm pin
        pin.children().remove();

        // handle empty slots
        console.log("   opretter " + (6 - stack.length) + " tomme rækker")
        for (var i = 0; i < 6 - stack.length; i++)
        {
            pin.append('<div class="row"><div class="">&nbsp;</div></div>')
        }

        // handle discs
        console.log("   opretter de " + stack.length + " skiver på pinden.")
        for(var disc of stack)
        {
            pin.append(
                '<div class="row">'
                +     '<div class="disc offset-sm-'+ (6-disc) +' col-sm-'+ (disc*2) +'">'+ disc +'</div>'
                + '</div>'
            );
        }
    }
}

/**
 * her er den kode som får jQuery til at til tillade at trække og slippe
 */
$(function(){
    gameWorld.pins = $('.hanoi-pin');
    startGame(gameWorld);

    $('.disc:first-of-type').draggable({stack: '.disc', revert:'invalid'});

    $('.hanoi-pin').droppable({
        tolerance: 'pointer',
        classes: {
            "ui-droppable-hover": "hanoi-pin-highlight"
        },
        drop: function( event, ui ){
            $('.alert').remove();
            var fromStackId = ui.draggable[0].parentElement.parentElement.id;
            var toStackId = this.id;
            if (isValidMove(fromStackId, toStackId, gameWorld))
            {
                moveDisc(fromStackId, toStackId, gameWorld);
            }
            else
            {
                // illigal move warning
                $('#alertSpace').append(
                    '<div class="alert alert-danger fade in" role="alert">'
                    +   '   <strong>Ups!</strong> You cannot place a disc, on another disc that is smaller.'
                    +   '</div>');
            }
            draw(gameWorld);
            $(this).removeClass('hanoi-pin-highlight');
            if (!checkWin(gameWorld)) {
                $('.hanoi-pin').each(function(index, element)
                {
                    $(this).find('.disc').first().draggable({stack: '.disc', revert: 'invalid'})
                });
            }
            else
            {
                // Success alert, with restart option
                $('#alertSpace').append(
                    '<div class="alert alert-success fade in" role="alert">'
                    +   '   <strong>Well done!</strong> You successfully moved all the discs. If you want to, you can '
                    +   '<button type="button" class="btn btn-success btn-sm" data-dismiss="alert" aria-label="Close">Try again</button>'
                    +   '</div>');

                $('.alert').find('.btn').click(function(){
                    $('.alert').remove();
                    startGame(gameWorld);
                    $('.disc:first-of-type').draggable({stack: '.disc', revert:'invalid'});
                })
            }
        },
        over: function( event, ui ){
            $(this).addClass('hanoi-pin-highlight');
        },
        out: function( event, ui ){
            $(this).removeClass('hanoi-pin-highlight');
        },

    });
})
