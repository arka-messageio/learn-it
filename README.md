# 📖 Learn It!
Spark student learning that actually lasts with Learn It! for Cisco Spark!

![Chat screenshot](https://cdn.glitch.com/1d239c36-6ae9-4f33-b667-6a11a6c3fdee%2FScreenshot2.png?1501600868760)

## Inspiration
Nowadays, teachers already have hundreds of tools available to test students and send them lectures using technology and the web. However, one aspect of the student experience that teachers still don't have easy access to is how students are learning _before_ they take a test.

Looking at scores is only an after-the-fact way of measuring student progress and does not give the educator any insights how his/her students are preparing. Worse, important tests and deadlines only promote last-minute cramming for students, which does not create a lasting understanding of a subject.

I designed **Learn It!** to help fix this problem and help both students and teachers have a better education experience.

## What it does
Being a student myself, I regularly use flashcard-studying sites like [StudyBlue](https://www.studyblue.com/) and [Quizlet](https://quizlet.com/) to help me practice and learn new concepts on my own. Most often, I will tell a friend to go ahead and "quiz me!" on a set of flashcards so that I can make sure that I have learned, and more importantly, retained the information.
Many of my friends and millions of other students worldwide do the same. Flashcard-studying has now become an important part of how we learn quickly.

Recognizing that this is an integral part of current student learning, **Learn It!** will search and import relevant sets of flashcards from these sites (only StudyBlue currently supported, but others coming soon!) and then help students study these flashcards through a natural conversational interface using Cisco Spark.

This conversational interface will feel very familiar to anyone who has used the "quiz me!" strategy with their friends before.

However, **Learn It!** does much, much more than simply repeat flashcards. It:
* Tracks how you answer flashcard questions and which questions you are hesitant on.
* Uses information about hesitancy and missed questions to test you in a manner that has been shown in cognitive psychology to improve memory retention of a subject.
  * Specifically, the SM-2 algorithm (which has been the subject university Masters theses!)
* Creates a plan for the user to use spaced repetition to gradually cover all the flashcards in a large set to discourage last-minute cramming.
* Engages the user in artificially intelligent (powered by [API.AI](https://api.ai)) so both student and teachers can feel comfortable using natural language with the bot, rather than simple mechanical commands.

And, perhaps most importantly, **Learn It!** provide teachers with an easy-to-use class management system so they can see how students are learning and what should be covered more in class lectures and curriculums _before_ students take a test.

## Accomplishments in this project
* Using the Cisco Spark integrations API in a new and interesting way - to power logins to **Learn It!** itself using the OAuth2 mechanism of the integrations API.
  * (Watch the video above to see this in action).
* Providing an intuitive natural-language interface.
* Using pre-existing university-level psychology research for widespread practical benefits today.

## What's next for **Learn It!**
* Integration with Cisco hardware like the [Cisco Spark Board](http://www.cisco.com/c/en/us/products/collaboration-endpoints/spark-board/index.html) to help schools adopt more useful Cisco Spark products.
* Adding support for [Quizlet](https://quizlet.com/) and other similar site as sources to import flashcards from.

## Tech stack
The following is a list of great tools we used to rapidly develop this chatbot in under a week:
 * [Bootstrap](http://getbootstrap.com/)
 * [Glitch](https://glitch.com/)
 * [API.AI](https://api.ai/)
 * [Botkit Core Library](https://github.com/howdyai/botkit#botkit-core-library)
