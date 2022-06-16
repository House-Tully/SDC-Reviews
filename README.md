# Executive Summary

“I worked on the reviews service for e-commerce website. I experienced strong tradeoffs between time spent fine-tuning db queries and time-to-MVP. A divide-and-conquer approach to query writing combined with load-balancing, caching, and indexing was an effective way to quickly obtain MVP. However, consolidating multiple queries into one was the best way to actually scale my service despite taking more time and adding complexity.”

**RANDOM ID GET:** scaled to 1k clients per second for random sampling of 100,000 records on /list and /meta GET endpoints with < 10 ms response time and < 0.003% error. Optimizations: indexing, load balancer with 4 services running

- /reviews/%{*:1-100000}/meta :: 1000 clients per second :: 5 ms 0.003% error rate

    ![list-1k.png](/assets/list-1k.png)

- /reviews/%{*:1-100000}/list :: 1000 clients per second :: 8ms 0.00% error rate

    ![meta-1k.png](/assets/meta-1k.png)


**REPEATING ID GET**: Scaled to 10k clients per second for /meta requests on repeating IDs served by cache. 5k clients per second for /list

- /reviews/%{*:100000-100010}/meta :: 10k clients per second :: 3ms with 149 errors ~0.0%

    ![meta-10k.png](/assets/meta-10k.png)


*Why I chose Postgres?*

- Data schema was highly defined. Did not need to adjust schema.

*Query Structure*

- Response times average < 50ms for any query. Meta was “heavier” endpoint with ~8 queries per call.

*Challenges*

- Building the meta query. Tried to do it in one query but opted to divide and conquer, which resulted in processing being done on server rather than db. I achieved MVP ahead of schedule but had to use more load balancers to scale my meta endpoint (higher cost).

*Lessons*

- Striving for a god-query seems to be worth the effort, but depends on how much time you have.
- Further improvements should be made based on user activity.
- Consider a separate db for the meta endpoint next.

*Possible Improvements*

- Separate db instance to serve the /meta endpoint
- ETL for meta data to remove calculations