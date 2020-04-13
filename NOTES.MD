## Workflow

1. Website scrapes moshtix for updates to booking page. (Might look at price of scrapy)
2. When detects tickets avaialbile it kicks off the script to start pre filling the details.
3. Sends a push notification to the user's device with a link they can click.
4. Links goes to a novnc website so they can view the server auto filling their details.
5. User will then need to confirm info is correct and right ticket before purchase just in case.
6. User interaction with the booking step is narrowed down to 1 click and pre filling details should take roughly 15 seconds.

Need to look at preserving login sessions between selenium runs.
Would be advantage is moshtix and paypal can remain logged in.

Might do research on a mobile app the creates a overlay of the website to auto fill the areas quicker. Might be faster than server method. Need to investigate.