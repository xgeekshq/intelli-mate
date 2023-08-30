# intelli-mate

**Supercharge your workplace productivity with collaboration enabled AI. Data is fully secured.**

## Purpose

The purpose of intelli-mate is to provide an open-sourced, customizable and efficient tool for workplaces to provide significant and safe collaborative AI experiences.

#### Collaborative?

Yes, we have created a product focused on getting the most out of AI by fusing human minds together in a chat. This way we know the results will be better from the llm model used and at the same time, more people are validating its output, leading to more efficient learning.

#### Safe?

Yes, intelli-mate is built around information safety and confidentiality. Our rooms are completely separate from each other, meaning that in no situation will the AI in room A know what's been said in room B.

On top of this, we have two more information security concepts:
1. **Roles** (configurable for each workplace) that restrict the access that rooms and users can have to information (both written by the participants and loaded through documents).
2. **Private rooms** that will only ever be visible to the users that are invited to join the room.

By combining these security factors, we ensure that the workplace information stays confidential under all circumstances.

## Tech stack

We are using a **monorepo** approach to handling the existing **UI**, **API** and **Contract** (with a bit of help from `nx`).

#### *UI (packages/web-ui)*

The framework chosen to create the UI web client for intelli-mate was `nextjs` at version `13` using `app router`.

#### *API (packages/api)*

The framework chosen to handle the API logic was `nestjs`, as well as a persistence layer with `mongodb` and caching mechanism with `redis`.
No specific architecture (clean, DDD, etc) is being followed, but **SOLID** best practices apply.

#### *Contract (packages/contract)*

All DTOs (TS types and zod schemas) being used to communicate between UI and API live in this package.

For now this package is being bundled together with the UI or the API in the build process. In the future, it may live in a private `npm repository` and installed through npm.
This would make it easier to communicate changes in the contract communication protocol to the UI.

#### Additional tech

##### *AI*

For the AI orchestration framework we are using `langchain` as it's currently the best open source framework for the topic.

##### *Socket*

As a collaborative chat, we need to have a real-time communication mechanism. We chose to use `web sockets` for the job and specifically the `Socket.io` tool to handle this.

## Development environment

_Step 1:_

We have two main dependencies to run the application locally:
1. mongodb
2. redis

> To run these you can either `docker-compose up -d` in `src/packages/api`
>
> OR
>
> `npm run start:db` and `npm run start:redis` in `src/packages/api/package.json`

**Pro-tip**: Install `MongoDB Compass` and `Redis Insight v2` so that you can easily check both the DB an the caching mechanism locally.

_Step 2:_

In the API copy `.env.example` and `.env.local.example` to `.env` and `.env.local` respectively and fill out the keys with the respective values.

In the UI copy `.env.example` to `.env` and fill out the keys with the respective values.

_Step 3:_

Configure the necessary application configurations for your workplace:

- API: `packages/api/config/default.json` and `packages/api/config/production.json` in case there are overrides for the production environment. The API is using the [config](https://www.npmjs.com/package/config) package to handle these.
- UI: `packages/web-ui/app-config/*.ts`

_Step 4:_

Start the API in watch mode with `npm run dev` and start the UI in dev mode with `npm run dev`, this should start your whole platform without any issues,

## Deployment

Check out our [deployment guide](./DEPLOYMENT.md) to the most common cloud providers.

## Want to contribute or found an issue?

Read our [contributing guidelines](./CONTRIBUTING.md).

## Our Code of Conduct

Read our [code of conduct](./CODE_OF_CONDUCT.md).

## License

Licensed under [Apache-2.0](./LICENSE).
