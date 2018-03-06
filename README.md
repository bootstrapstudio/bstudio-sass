# Bootstrap Studio SASS sidekick

`bstudio-sass` is a helper utility for compiling SASS in Bootstrap Studio. To use it, install it on your local machine and configure Bootstrap Studio to know where to find it. It runs on Windows, MacOS and Linux.

## Installation

To install `bstudio-sass`, follow these steps:

1. Install a recent version of [nodejs](https://nodejs.org/en/) for your os, if you don't have it already.
2. Open a terminal/console window, and run this command: `npm install bstudio-sass -g`
3. After the above is done, run this command to test if everything works: `bstudio-sass`. You should see a message that everything is installed correctly, and a path that you should use.
4. Open the **File > Design Settings** dialog, and in the SASS tab paste the path to bstudio-sass that you got in the above step.

## Troubleshooting

If you run `bstudio-sass` and see a *command not found* error, this would mean that the utility is not installed correctly. The `-g` flag that you pass in step 2 above is important, as it tells npm to make the utility globally available on the system, so be sure you're not missing it. If it still doesn't work, maybe node is not installed correctly or your system needs a restart.

## License

This project is licensed uner the MIT license.

## Bug reports

If you notice any bugs, please [report them here](https://bootstrapstudio.io/bug-report).
