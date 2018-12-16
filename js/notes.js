/******* issues:
typo: errand should be errands, both in html and when writing to db
nickname can still be empty even though it's required


*/

/******* need to add:

preference modal: skip for now should still write to db, only with empty values

add hint with feedback from db, such as too weak password and user already exists

add if user has a preference setting in which type of animal to see and user wants to receive notification about new animals, only notify that chosen type 

cancel membership button 

styling in form fields

*/

/*******  would be nice:
make all close button X the same class and style


*/

/******* need to discuss
user need to check all sizes/genders/types if he really want to see all? Should we add a option of "all"?

give a default value for monthly donation? If so, remember the resetForm function needs to be changed to have special treatment for range input 

*/

/** 
 * DONE

preference not poping up after sign up

deal with page reload, where to get the current user value (might need to keep a copy in session)

add user's news setting to the member table in db

show monthly donation nr, instead of just a range bar. Or change to number input, don't use input type range anymore.  

clear form at each re-render

*/
