function gcd(a, b) {
    a = Math.abs(a);
    b = Math.abs(b);
    while (b) {
        let t = b;
        b = a % b;
        a = t;
    }
    return a;
}

export default class Fraction {
    constructor(n, d = 1) {
        if (d === 0) {
            throw new Error("Denominator cannot be zero");
        }
        let common = gcd(n, d);
        let sign = (n < 0 ? -1 : 1) * (d < 0 ? -1 : 1);
        this.n = sign * Math.abs(n / common);
        this.d = Math.abs(d / common);
    }

    add(other) {
        if (!(other instanceof Fraction)) {
            other = new Fraction(other);
        }
        return new Fraction(this.n * other.d + other.n * this.d, this.d * other.d);
    }

    sub(other) {
        if (!(other instanceof Fraction)) {
            other = new Fraction(other);
        }
        return new Fraction(this.n * other.d - other.n * this.d, this.d * other.d);
    }

    mul(other) {
        if (!(other instanceof Fraction)) {
            other = new Fraction(other);
        }
        return new Fraction(this.n * other.n, this.d * other.d);
    }

    div(other) {
        if (!(other instanceof Fraction)) {
            other = new Fraction(other);
        }
        return new Fraction(this.n * other.d, this.d * other.n);
    }

    valueOf() {
        return this.n / this.d;
    }

    toString() {
        if (this.d === 1) {
            return `${this.n}`;
        }
        return `${this.n}/${this.d}`;
    }

    equals(other) {
        if (!(other instanceof Fraction)) {
            other = new Fraction(other);
        }
        return this.n === other.n && this.d === other.d;
    }

    greaterThan(other) {
        return this.valueOf() > (other instanceof Fraction ? other.valueOf() : other);
    }

    lessThan(other) {
        return this.valueOf() < (other instanceof Fraction ? other.valueOf() : other);
    }
}
