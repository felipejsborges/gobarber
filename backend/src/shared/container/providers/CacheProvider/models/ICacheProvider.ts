export default interface ICacheProvider {
	save(key: string, value: any): Promise<void>; // save something on cache
	recover<T>(key: string): Promise<T | null>; // get
	invalidate(key: string): Promise<void>; // delete
	invalidatePrefix(prefix: string): Promise<void>; // delete with a prefix
}
