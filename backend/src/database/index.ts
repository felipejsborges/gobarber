import { createConnection } from 'typeorm';

createConnection(); // this function read the ormconfig.json before connect to DB. I could set the config of ormconfig.json like a param of this function. But when I use typeorm-cli, it will not read this params. It reads only the ormconfig.json
