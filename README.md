
# Micro-saas 
This micro-saas was used to develop the skills of working with the largest stripe 
payment gateway in the world.

In this saas, a TODO application was developed, where the user could register up to 5 free tasks, and then would have to complete the payment process to register activities without limitations.




## Stack⛏

**Back-end:** BunJs, Prisma, Express

**Gateway :** Stripe






## Install and running project

#### Install bunjs

Bun is an all-in-one JavaScript runtime & toolkit designed for speed, complete with a bundler, test runner, and Node.js-compatible package manager.

```bash
  powershell -c "irm bun.sh/install.ps1 | iex"
```
![bunjs](https://i.ibb.co/FbLhgXj/bun.png)


#### Stripe

Additionally, you need to create an account on Stripe and create your access keys. in the project index with the name "config.ts"

```javascript
export const config = {
    stripe: {
        publishableKey: 'your publishable Key',
        secretKey: 'your secret key',
        proPriceId: 'your priceid',
        webhookScret: 'your webhook Scret'
    }
}
```

Then you need to install a stripe CLI to run locally

```link
  https://docs.stripe.com/stripe-cli
```

Then you need to configure the webhook to test the application


```link
  https://docs.stripe.com/webhooks/quickstart
```



#### Install my-project with bun

```bash
  bun install
```
## Running Project
```bash
  bun dev
```


    
