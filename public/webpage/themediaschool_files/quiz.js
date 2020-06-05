Object.keys||(Object.keys=function(){"use strict";var t=Object.prototype.hasOwnProperty,r=!{toString:null}.propertyIsEnumerable("toString"),e=["toString","toLocaleString","valueOf","hasOwnProperty","isPrototypeOf","propertyIsEnumerable","constructor"],o=e.length;return function(n){if("function"!=typeof n&&("object"!=typeof n||null===n))throw new TypeError("Object.keys called on non-object");var c,l,p=[];for(c in n)t.call(n,c)&&p.push(c);if(r)for(l=0;l<o;l++)t.call(n,e[l])&&p.push(e[l]);return p}}());

if ($("#quiz")) {

    // Move quiz to end of document
    // $("#quiz").detach().insertAfter(".off-canvas-wrapper-inner");
    $("#quiz").detach().insertAfter("#main-content .section:last-child");

    // Set up counter to make IDs unique
    var counter = 0,
        $launchButton;

    $("a[href^='#launch_quiz']").each(function() {
        var $this = $(this),
            thisId;

        thisId = 'launch-quiz-' + counter;

        $this.attr({
            'id': thisId
        });

        counter++;
    });

    $('a[id^="launch-quiz"]').each(function() {
        $(this).on('click', function(event) {
            event.preventDefault();
            $('body').addClass('quiz-open');
            $("#quiz").removeClass("minimized");
            $("#quiz").addClass("maximized");
            $("body").css({
                "overflow": "hidden"
            });

            setTimeout(function() {
                quiz.trapFocus();
            }, 500);

            $launchButton = $(this);
        });
    });

    $("body").on("click", "#close-quiz", function() {
        $('body').removeClass('quiz-open');
        $("#quiz").removeClass("maximized");
        $("#quiz").addClass("minimized");
        $("body").css({
            "overflow": "visible"
        });
        $(".next-button").removeClass("show");

        setTimeout(function() {
            $launchButton.focus();
        }, 500);
    });

    $("body").on("click", ".radio-box input, .radio-box label", function() {
        if ($(this).is(':checked')) {
            $(this).parents(".quiz-choices").next(".quiz-actions").find(".next-button, .submit-quiz").addClass("show");
        }
    });

    var quiz = new Vue({
        el: '#quiz',
        delimiters: ['!{', '}'],

        data: {
            quizComplete: false,
            step: 0,
            quizQuestions: {},
            quizDegrees: {},
            userChoices: [],
            tallyOriginal: [],
            tallyModified: [],
            topTwoDegrees: [],
            topTwoDescriptions: [],
            topTwoPaths: []
        },

        created: function() {
            this.fetchData();
        },

        methods: {
            fetchData: function() {
                var scope = this;
                // $.getJSON("data/quiz.json", function(quizData) {
                $.getJSON("../_php/quiz-json.php", function(quizData) {
                    scope.quizQuestions = quizData.quizQuestions;
                    scope.quizDegrees = quizData.quizDegrees;
                });
            },

            tallyQuiz: function() {
                var scope = this,
                    $calculableQuestions = $('input[data-calculate=true]:checked');

                $calculableQuestions.each(function() {
                    var $this = $(this),
                        calculableQuestionsIdx = $this.attr('data-idx'),
                        calculableQuestionsScore = $this.attr('data-score');

                    scope.userChoices[calculableQuestionsIdx] = calculableQuestionsScore;
                });

                this.checkScores(scope.userChoices);

                this.quizComplete = true;

                setTimeout(function() {
                    scope.trapFocus();
                }, 500);
            },

            checkScores: function(tallyArray) {
                var scope = this,
                    counter = 0;

                while (counter < scope.quizDegrees.length) {
                    var focusMatches = 0;

                    tallyArray.forEach(function(element, index) {
                        if (scope.quizDegrees[counter].rubric[index] === element) {
                            focusMatches += 1;
                        }
                    });

                    // Construct both original tally and "modifiable" tally
                    scope.tallyOriginal[scope.quizDegrees[counter].idx] = focusMatches;
                    scope.tallyModified[scope.quizDegrees[counter].idx] = focusMatches;

                    counter++;
                }

                var topTwoCounter = 0;
                while (topTwoCounter < 2) {
                    // Return highest value in array
                    var highestValue = scope.tallyModified.reduce(function(a, b) {
                        return Math.max(a, b);
                    });

                    var highestIndex = scope.tallyModified.indexOf(highestValue),
                        thisDegree = scope.quizDegrees[highestIndex].focus,
                        thisDegreeDescription = scope.quizDegrees[highestIndex].description,
                        thisDegreePath = scope.quizDegrees[highestIndex].path;

                    scope.topTwoDegrees.push(thisDegree);
                    scope.topTwoDescriptions.push(thisDegreeDescription);
                    scope.topTwoPaths.push(thisDegreePath);

                    // Zero out value of highest index in tallyModified array to prevent being counted again
                    scope.tallyModified[highestIndex] = 0;

                    topTwoCounter++;
                }
            },

            retakeQuiz: function() {
                var scope = this;

                // Move back to step 1
                this.quizComplete = false;

                this.step = 0;

                // Reset tally arrays
                this.tallyOriginal.length = 0;
                this.tallyModified.length = 0;
                this.topTwoDegrees.length = 0;
                this.topTwoDescriptions.length = 0;
                this.topTwoPaths.length = 0;
                this.userChoices.length = 0;

                // Reset all questions to default state
                $('.radio-box input').each(function() {
                    var $this = $(this);
                    $(this).prop("checked", false);
                });

                this.fetchData();

                setTimeout(function() {
                    scope.trapFocus();
                }, 500);
            },

            moveQuestionForward: function(idx) {
                var scope = this;
                scope.step = idx + 1;
                setTimeout(function() {
                    scope.trapFocus();
                }, 500);
            },

            moveQuestionBackward: function(idx) {
                var scope = this;
                scope.step = idx - 1;
                setTimeout(function() {
                    scope.trapFocus();
                }, 500);
            },

            trapFocus: function() {
                var scope = this,
                    $quizContainer = $('#home').find('#quiz'),
                    $visibleQuestion = $quizContainer.find('.question:visible'),
                    $firstFocusableElement,
                    $lastLink = $quizContainer.find('#close-quiz'),
                    KEYCODE_TAB = 9;

                if (scope.quizComplete == true) {

                    $firstFocusableElement = $('.top-degree');
                    $firstFocusableElement.attr('tabindex', 0).focus();

                } else if (scope.quizComplete == false) {

                    $firstFocusableElement = $visibleQuestion.find('.question-number');
                    $firstFocusableElement.attr('tabindex', 0).focus();

                }

                $quizContainer.on('keydown', function(e) {
                    var isTabPressed = (e.key === 'Tab' || e.keyCode === KEYCODE_TAB);

                    if (!isTabPressed) {
                        return;
                    }

                    if ( e.shiftKey ) {
                        if ($(':focus').is($firstFocusableElement)) {
                            $lastLink.focus();
                            e.preventDefault();
                        }
                    } else {
                        if ($(':focus').is($lastLink)) {
                            $firstFocusableElement.focus();
                            e.preventDefault();
                        }
                    }

                });
            }
        }
    });
}

if (window.location.hash === '#quiz') {
    $('#launch-quiz-0').trigger('click');
}