# Moni Wallet

A mini wallet to track expenses
Framework: Nestjs

## Start application on DEV mode

```
npm run start:dev
```

## Start application on PROD mode

```
npm run start
```

## Test application

```
npm run test
```

# Swagger Documentation

Swagger documentation can be found here `{{baseUrl}}/docs`

`https://ruby-lonely-scallop.cyclic.app/docs`

## Checklist

You are to create a simple P2P wallet system with the following features

- [x] Create a user with this detail <first_name, last_name, email, address, dob, phone_number>
- [x] Create a wallet for the user with this detail <balance, reference, user_id: fKey, previous_balance, e.t.c.>
- [x] Users should be able to fund their wallets on the system - (Use Paystack funding options)
- [x] Users should be able to send funds to other users on the system User should be able to receive funds from other users on the system
