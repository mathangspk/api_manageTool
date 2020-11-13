
const Joi = require('joi')
//register validation
const resgisterValidation = (data) => {
    const schema = {
        name: Joi.string().min(6).required(),
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, schema)
}
const loginValidation = (data) => {
    const schema = {
        email: Joi.string().min(6).required().email(),
        password: Joi.string().min(6).required()
    }
    return Joi.validate(data, schema)
}
const createOrderValidation = (data) => {
    const schema = {
        customerId: Joi.string().required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Tên khách hàng không để trống" };
                    }
                })
            }),
        tool: Joi.string().min(1).required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "number.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Vui lòng chọn sản phẩm" };
                    }
                })
            }),
        quantity: Joi.number().min(1).required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "number.min":
                            return { message: "Số lượng nhỏ nhất là 1" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Số lượng không để trống" };
                    }
                })
            }),
        price: Joi.number().min(1).required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "number.min":
                            return { message: "Vui lòng nhập giá sản phẩm" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Số lượng không để trống" };
                    }
                })
            }),
        cash: Joi.number().min(1).required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "number.min":
                            return { message: "Vui lòng nhập tổng tiền đơn hàng" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Số lượng không để trống" };
                    }
                })
            }),
        status: Joi.string().required()

    }
    return Joi.validate(data, schema)
}


const toolValidation = (data) => {
    const schema = {
        name: Joi.string().required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Tên sản phẩm không để trống" };
                    }
                })
            }),
        manufacturer: Joi.string().min(1).required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "number.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Mô tả sản phẩm không để trống" };
                    }
                })
            }),
        quantity: Joi.number().min(0).required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "number.min":
                            return { message: "Vui lòng nhập số lượng" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Số lượng không để trống" };
                    }
                })
            }),
        toolId: Joi.number().min(1).required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "number.min":
                            return { message: "Vui lòng nhập giá sản phẩm" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "ProductId không để trống" };
                    }
                })
            }),
        status: Joi.number(),
        images: Joi.array(),
    }
    return Joi.validate(data, schema)
}

const customerValidation = (data) => {
    const schema = {
        name: Joi.string().required()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Tên khách hàng không để trống" };
                    }
                })
            }),
            address: Joi.string()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Tên khách hàng không để trống" };
                    }
                })
            }),
            phoneNumber: Joi.number()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Tên khách hàng không để trống" };
                    }
                })
            }),
            facebook: Joi.string()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Tên khách hàng không để trống" };
                    }
                })
            }),
    }
    return Joi.validate(data, schema)
}
const postValidation = (data) => {
    const schema = {
            title: Joi.string()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Tiêu đề không để trống" };
                    }
                })
            }),
            author: Joi.string()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Tên tác giả không để trống" };
                    }
                })
            }),
            description: Joi.string()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Mô tả không để trống" };
                    }
                })
            }),
            content: Joi.string()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Nội dung không để trống" };
                    }
                })
            }),
            category: Joi.string()
            .error((errors) => {
                return errors.map(error => {
                    switch (error.type) {
                        case "string.min":
                            return { message: "first msg" };
                        case "string.max":
                            return { message: "second msg" };
                        case "any.empty":
                            return { message: "Danh mục không để trống" };
                    }
                })
            }),
    }
    return Joi.validate(data, schema)
}

module.exports.toolValidation = toolValidation;
module.exports.resgisterValidation = resgisterValidation;
module.exports.loginValidation = loginValidation;
module.exports.createOrderValidation = createOrderValidation;
module.exports.customerValidation = customerValidation;
module.exports.postValidation = postValidation;