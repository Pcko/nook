import {promptBuilder} from "../../../dist/util/promptBuilder/promptBuilder.js";
const result =await promptBuilder.build("i am a plumber and i need a website!");
console.log(result)