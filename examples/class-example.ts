import {
    instrument
} from "../src/index";

class ClassExample {
    @instrument
    async method0(){
        throw new Error("here is error")
        return "here"
    }
    @instrument
    async method1(){
        try{
            await this.method0()
        } catch (e){
            console.log(e.message)
        }
    }
}



(new ClassExample).method1();