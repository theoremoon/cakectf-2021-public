const partialUpdate = <T>(obj: T, update: Partial<T>): T => {
    return {...obj, ...update}
}
export default partialUpdate;