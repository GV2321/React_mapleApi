function formatKoreanNumber(value) {
    const units = ["", "만 ", "억 "];
    const digits = value.split("").reverse();

    let result = '';
    for (let i = 0; i < digits.length; i += 4) {
        const chunk = digits.slice(i, i + 4).reverse().join('');
        const unit = units[i / 4];
        result = chunk + unit + result;
    }

    return result;
}

export default formatKoreanNumber;