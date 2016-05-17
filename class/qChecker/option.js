function Checker( correct ) {
	if ( !( this instanceof Checker ) ) return new Checker();
    if(!correct || Array.isArray(correct) || typeof correct !== 'object') throw new Error('Invalid input.');
    Object.keys(correct).map(k => {
        if(typeof correct[k] !== 'boolean') throw new Error('Invalid input.');
    });
    this.correct = correct;
};

Checker.prototype.check = function check(attempt){
    //TODO
    if(Array.isArray(attempt))
};
