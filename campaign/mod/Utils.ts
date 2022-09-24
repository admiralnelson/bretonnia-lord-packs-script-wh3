namespace AdmiralNelsonLordPack {
    type Data = null|Object|Number|String|Array<any> 
    export class localStorage {
        public static setItem(key: string, value: Data) : void {
            cm.set_saved_value(key, value)
        }
        public static getItem(key: string): any {
            return cm.get_saved_value(key)
        }
        public static removeItem(key: string): any {
            return cm.set_saved_value(key, null)
        }
    }
}