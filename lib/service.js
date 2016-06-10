
import utils from 'elliptical-utils'

let object=utils.object;

class Service{

    /**
     *
     * @param {Object} params
     */
    constructor(params){
        if(params) this._data = params;
        this.$query = {};
    }

    /**
     *
     * @param {Object} params
     * @param {Object} query
     * @param {Function} callback
     */
    static get(params, query, callback){
        if (typeof query === 'function') {
            callback = query;
            query = {};
        }
        var self = this,
            $provider = this.$provider,
            $paginationProvider = this.$paginationProvider,
            resource = this['@resource'],
            result=null;

        $provider.get(params, resource, query, function (err, data) {
            if (!err) {
                self._data=data;
                if (query.paginate && $paginationProvider) result = $paginationProvider.get(query, data);
                else result = data;
            }
            if (callback) callback(err, result);
        });
    }
    
    
    /**
     *
     * @param {Object} params
     * @param {Object} query
     * @returns {Promise}
     */
    static async getAsync(params, query){
        var self = this;
        var $provider = this.$provider;
        var $paginationProvider = this.$paginationProvider;
        var resource = this['@resource'];
        var result;
        if(query===undefined) query={};
        return new Promise(function(resolve,reject){
            $provider.get(params, resource, query, function (err, data) {
                if(err) reject(err);
                else{
                    self._data=data;
                    if (query.paginate && $paginationProvider) result = $paginationProvider.get(query, data);
                    else result = data;
                    resolve(result);
                }
            });
        });
    }

    /**
     * 
     * @param {Object} params
     * @param {Function} callback
     */
    static post(params,callback){
        var $provider = this.$provider,
            resource = this['@resource'];
        $provider.post(params, resource, callback);
    }

    /**
     *
     * @param {Object} params
     * @returns {Promise}
     */
    static async postAsync(params){
        var $provider = this.$provider;
        var resource = this['@resource'];
        return new Promise(function(resolve,reject){
            $provider.post(params, resource, function(err,data){
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    /**
     * 
     * @param {Object} params
     * @param {Function} callback
     */
    static put(params,callback){
        var $provider = this.$provider,
            resource = this['@resource'];
        $provider.put(params, resource, callback);
    }

    /**
     *
     * @param {Object} params
     * @returns {Promise}
     */
    static async putAsync(params){
        var $provider = this.$provider;
        var resource = this['@resource'];
        return new Promise(function(resolve,reject){
            $provider.put(params, resource, function(err,data){
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    /**
     * @param {Object} params
     * @returns {Promise}
     */
    static async deleteAsync(params){
        var $provider = this.$provider;
        var resource = this['@resource'];
        return new Promise(function(resolve,reject){
            $provider.delete(params, resource, function(err,data){
                if(err) reject(err);
                else resolve(data);
            });
        });
    }

    /**
     * 
     * @param {Object} params
     * @param {Function} callback
     */
    static delete(params,callback){
        var $provider = this.$provider,
            resource = this['@resource'];
        $provider.delete(params, resource, callback);
    }

    /**
     * 
     * @param {Object} obj
     * @returns {Object}
     * @private
     */
    static _toQueryable(obj){
        if(typeof obj!=='object')return obj;
        var qry={};
        for(var key in obj){
            if(obj.hasOwnProperty(key)){
                if(key.indexOf('$')!==0)qry[key]=obj[key];
            }
        }
        return qry;
    }

    /**
     *
     * @param {Object} params
     * @returns {Promise}
     */
    async getAsync(params){
        var query=this.$query;
        return this.constructor.getAsync(params, query);
    }

    /**
     * 
     * @param {Object} params
     * @param {Function} callback
     */
    get(params,callback){
        var data = this._data,
            query = this.$query;
        if(typeof params === 'function') {
            callback = params;
            params = data;
        }
        this.constructor.get(params, query, callback);
    }

    /**
     *
     * @param {Object} params
     * @returns {Promise}
     */
    async postAsync(params){
        return this.constructor.postAsync(params);
    }

    /**
     * 
     * @param {Object} params
     * @param {Function} callback
     */
    post(params,callback){
        var data = this._data;
        if(typeof params === 'function') {
            callback = params;
            params = data;
        }
        this.constructor.post(params, callback);
    }

    /**
     *
     * @param  {Object} params
     * @returns {Promise}
     */
    async putAsync(params){
        return this.constructor.putAsync(params);
    }

    /**
     * 
     * @param {Object} params
     * @param {Function} callback
     */
    put(params,callback){
        var data = this._data;
        if(typeof params === 'function') {
            callback = params;
            params = data;
        }
        this.constructor.put(params, callback);
    }

    /**
     *
     * @param {Object} params
     * @returns {Promise}
     */
    async deleteAsync(params){
        return this.constructor.deleteAsync(params);
    }

    /**
     * 
     * @param {Object} params
     * @param {Function} callback
     */
    delete(params,callback){
        var x=parseFloat(params);
        this.constructor.delete(params,callback);
    }

    /**
     *
     * @param {Object} params
     * @returns {Promise}
     */
    async saveAsync(params) {
        var idProp = this.constructor.id;
        var data = this._data;
        if (params === undefined) params = data;
        if (params[idProp]) return this.constructor.putAsync(params);
        else return this.constructor.postAsync(params);
    }

    /**
     * 
     * @param {Object} params
     * @param {Function} callback
     */
    save(params,callback){
        var idProp = this.constructor.id;
        var data = this._data;
        if (params === undefined) params = data;
        if (params[idProp]) this.constructor.put(params,callback);
        else this.constructor.post(params,callback);
    }

    /**
     * 
     * @param {Object} val
     * @returns {Service}
     */
    filter(val){
        if(val){
            if(typeof val==='object'){
                var newVal=this._toQueryable(val);
                if(!object.isEmpty(newVal))this.$query.filter = newVal;
            }else this.$query.filter = val;
        }
        return this;
    }

    /**
     * 
     * @param {Object} val
     * @returns {Service}
     */
    orderBy(val){
        if(val && !object.isEmpty(val))this.$query.orderBy = val;
        return this;
    }

    /**
     * 
     * @param {Object} val
     * @returns {Service}
     */
    orderByDesc(val){
        if(val && !object.isEmpty(val))this.$query.orderByDesc = val;
        return this;
    }

    /**
     * 
     * @param {Object} val
     * @returns {Service}
     */
    top(val){
        if(val && !object.isEmpty(val))this.$query.top = val;
        return this;
    }

    /**
     * 
     * @param {Object} val
     * @returns {Service}
     */
    skip(val){
        if(val && !object.isEmpty(val))this.$query.skip = val;
        return this;
    }

    /**
     * 
     * @param {Object} params
     * @returns {Service}
     */
    paginate(params){
        try {
            params.page = parseInt(params.page);
        } catch (ex) {
            params.page = 1;
        }
        this.$query.paginate = params;
        return this;
    }

    /**
     * 
     * @param {Object} obj
     * @returns {Object}
     * @private
     */
    _toQueryable(obj){
       return this.constructor._toQueryable(obj);
    }
    
}


Service.id='id';
Service.$provider=null;
Service["@resource"]=null;
Service._data=null;
Service.$paginationProvider=null;


export default Service;