/* eslint-disable */
/* "stolen" from https://github.com/lblod/frontend-toezicht-abb/blob/04297657e7960b72741f1eaf43c649f84f93c0b9/app/utils/snapshot.js */
import { compare } from '@ember/utils';

export default class Snapshot {
  base = null;
  future = null;

  constructor( base ) {
    this.base = base;
  }

  stage( object ) {
    this.future = Object.assign( object, {} );
  }

  stageLive( object ) {
    this.future = object;
  }

  commit() {
    this.base = Object.assign( this.future, {} );
  }

  anyFieldChanged(fields) {
    for (let field of fields) {
      if (this.fieldChanged(field))
        return true;
    }
    return false;
  }

  fieldChanged(field) {
    if( !this.hasBase || !this.hasStaging ) {
      return this.baseOrEmpty.hasOwnProperty(field) || this.futureOrEmpty.hasOwnProperty(field);
    } else {
      return compare(this.base[field], this.future[field]) !== 0; // Modified original to work for arrays
    }
  }

  get hasBase() {
    return this.base && true;
  }

  get hasStaging() {
    return this.future && true;
  }

  get committed() {
    return this.base;
  }

  get baseOrEmpty() {
    return this.base || {};
  }

  get futureOrEmpty() {
    return this.future || {};
  }
}