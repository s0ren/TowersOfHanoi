/** *********************************************************************************************************************

 @license
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

 ********************************************************************************************************************* */


/**
 * A structure to hold all information about the current state of the game. <br>
 *
 * The pins are the html div element that holds the discs the user can drag. <br>
 *      Pins are also where discs land when they are dropped. <br>
 *
 * stacks holds three arrays, representing the pins and their discs. One the left one in the middle and one to the right. <br>
 *
 * numberOfDiscs is how many discs there is in the game. Six is standard. More discs makes the game harder
 * (or, at least longer) to solve. Less discs are simpler, and perhaps better for debuging and analysis. <br>
 *
 * The functions startGame resets the gameWorld, so that the left stack contains {numberOfDiscs} discs.
 * Center and right are cleared and empty. <br>
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
 * Resets the gameWorld, so that the left stack contains {numberOfDiscs} discs.
 * Center and right are cleared and empty.
 *
 * @param {object} gameWorld - The global with all info on current game state.
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
 * Move the top disk from one stack to another.
 * Called by the global anonymous function (Arrrgh awful "name" // TODO give it a real name )
 *
 * @param {array} fromStack - The disc stack to move a disc from
 * @param {array} toStack - The disc stack to move a disc to
 */
function moveDisc(fromStack, toStack)
{
    toStack.unshift(fromStack.shift());
}

/**
 * Checks if an intented move is valid or not, before it is actually done.
 * Called by the global anonymous function (Arrrgh awful "name" // TODO give it a real name )
 *
 * Rules: the disk to move must be smaller that the one it is to land upon, or it can be dropped on an empty stack.
 *
 * @param {array} fromStack - The disc stack to move a disc from
 * @param {array} toStack - The disc stack to move a disc to
 * @returns {boolean} true if move is valid, false if not
 *
 */
function isValidMove(fromStack, toStack)
{
    return  !(fromStack[0] > toStack[0]);
}

/**
 * Check if the game is solved and there for over.
 * Called by the global anonymous function (Arrrgh awful "name" // TODO give it a real name )
 * @param {object} gameWorld - The global with all info on current game state.
 * @returns {boolean}
 */
function checkWin(gameWorld)
{
    var rigthStack = gameWorld.stacks['right'];
    if (rigthStack.length < gameWorld.numberOfDiscs)
    {
        return false;
    }
    for (var i in rigthStack)
    {
        if ((Number(i) +1 ) != rigthStack[i])
        {
            return false;
        }
    }
    return true;
}

/**
 *
 * Called by the global anonymous function (Arrrgh awful "name" // TODO give it a real name )
 * @param {object} gameWorld - The global with all info on current game state. Used to define what to draw.
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
 * The Great Global Anonymous Function
 * This code makes jQuery allow drag and drop, and so forth...
 * Uses gameWorld and calls draw, isValidMove, moveDisc and checkWin.
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
            var fromStack = gameWorld.stacks[fromStackId];
            var toStack = gameWorld.stacks[toStackId];

            if (isValidMove(fromStack, toStack, gameWorld))
            {
                moveDisc(fromStack, toStack, gameWorld);
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
