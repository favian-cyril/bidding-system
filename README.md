## How to start project

Prerequisites:
npm, npx and Node18+

Step 1:

Create .env file with content:
```
# Required
DATABASE_URL="file:./{{database_name}}.db"
# Optional defaults to http://localhost:3000
BASE_URL="http://localhost:3000"
```

Step 2:

Run these commands:
```bash
npm i
# Generate database file
npm generate-db
# Generate mock data
npm generate-mock

npm run dev
```

## Questions

How would you monitor the application to ensure it is running smoothly?

To ensure the application is running smoothly we need to be able to monitor its performance and errors, we can achieve that by integrating with software such as sentry. We would then be able to store data such as response times, load times and any unhandled errors in the dashboard which can be further integrated with error reporting and auto assigning tasks to team members.

How would you address scalability and performance?

- Scalability issues can be solved by first docoupling backend and frontend server to have a better understanding and control of how much load and where the bottleneck is, from there we can decide what methods to use to scale such as using load balancer, horizontal scaling, caching and others. Database should also be adjusted to be more scalable such using postgresql or mysql which has features to enable replication or sharding, luckily because this project uses prisma we can change database easily without needing to define the schema again. Lastly another important factor to consider is scalability testing such as load testing which can give you an estimate on how well the system performs under load.

- Performance should always be monitored and examined constantly. Currently the application should be sufficient for the amount of data that it has, but if performance starts to degrade there are a few solutions that can be applied. Query optimization is one of the solutions that can increase performance even though there is no expensive joins currently. This requires monitoring of the database queries which are usually handled by the RDBMS

Trade-offs you had to choose when doing this challenge

I think if I were to create a real application I would choose to use something like Firebase or Supabase instead because it would really increase the development speed especially if auth is needed. Also as a personal preference and because this is the first time I've used nextjs' server components/actions and I prefer the design of something like SvelteKit which is simpler in terms of separating client side and server side. Currently there's a bug when running the test because of the use of experimental feature in react-dom and I haven't been able to find a workaround yet.
