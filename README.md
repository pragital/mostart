# Mostart Remote Device Control (mostart)

Control your remote devices using a friendly interface and SMS.

Mostart is a rather simple app to send/receive SMS to/from your remote device. The features include -

1. Configurable messages to start / stop remote device. SMS messages can include the pre-defined fields
1. Check status of device using SMS
1. Ability to receive SMS messages from remote device to confirm requested operation

All operations should be supported by a suitable controller installed on the remote device. Mostart just provides a user-friendly frontend :)

A few features are deliberately avoided for the sake of simplicity, maintain low costs, and keeping in mind the target audience -

1. No background service for timing out operations or schedule operations
1. No push/pull notifications

## Install the dependencies

```bash
yarn
```

### Start the app in development mode (hot-code reloading, error reporting, etc.)

```bash
quasar dev
```

### Lint the files

```bash
yarn run lint
```

### Build the app for production

```bash
quasar build
```

### Customize the configuration

See [Configuring quasar.conf.js](https://quasar.dev/quasar-cli/quasar-conf-js).
