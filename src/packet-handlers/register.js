const log = require('bole')('register');

const userRegex = "^[a-zA-Z0-9]{3,12}$";
const passRegex = "^.{5,20}$";

//adding in a check for usernames to filter out bullshit. a-z A-Z 0-9 range. -K
function usernameCheck(u){
  let checkedUsername = u.match(userRegex);
  if(!checkedUsername || typeof checkedUsername != "string"){
    checkedUsername = false;
  } else if(typeof checkedUsername == "string") {
    checkedUsername.toString();
  } else {
    checkedUsername = false;
  }
  return checkedUsername;
};

//adding in a check for usernames to filter out bullshit. a-z A-Z 0-9 range. -K
function passwordCheck(p){
  let checkedPassword = p.match(passRegex);
  if(!checkedPassword || typeof checkedPassword != "string"){
    checkedPassword = false;
  } else if(typeof checkedPassword == "string") {
    checkedPassword.toString();
  } else {
    checkedPassword = false;
  }
  return checkedPassword;
};


async function register(socket, message) {
    const { config, dataClient } = socket.server;
    let { version, username, password } = message;
    const ip = socket.getIPAddress();

    console.log(`REGISTER: socket:`);
    console.log(socket);
    console.log(`REGISTER: message:`);
    console.log(message);

    username = usernameCheck(username);
    password = passwordCheck(password);

    if(username == false) {
        socket.send(Buffer.from([23]));
        return;
    }
    if(password == false) {
        socket.send(Buffer.from([24]));
        return;
    }

    // only free-to-play worlds support registration
    if (socket.server.world.members) {
        socket.send(Buffer.from([15]));
        return;
    }

    if (version !== config.version) {
        socket.send(Buffer.from([5]));
        return;
    }

    const { code, success } = await dataClient.playerRegister({
        username,
        password,
        ip
    });

    if (success) {
        log.info(`${username} registered from ${ip}`);
    }

    socket.send(Buffer.from([code]));
}

module.exports = { register };
