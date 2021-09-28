// GET Routes
module.exports.getProducts = (req, res) => {
    req.user.getProducts().then(products => {
        res.render('admin/products', { products,  pageTitle: 'Products', linkIndex: 5 });
    }).catch(error => {
        console.log(error);
        res.status(500).render('admin/products', { pageTitle: 'Products', linkIndex: 5, products: [] });
    });
};

module.exports.getAddProduct = (_req, res) => {
    res.render('admin/edit-product', { pageTitle: 'Add Product', linkIndex: 4, editing: false });
};

module.exports.getEditProduct = (req, res) => {
    const editing = JSON.parse(req.query.edit || false);

    if(!editing) {
        return res.status(400).redirect('/admin/products');
    }

    req.user.getProducts({ where: { id: req.params.id } }).then(products => {
        if(products.length === 0) {
            return res.status(500).redirect('/admin/products');
        }

        const product = products[0];
        res.render('admin/edit-product', { pageTitle: 'Edit Product', linkIndex: 5, editing, product });
    });
};

// POST Routes
module.exports.postAddProduct = (req, res) => {
    let { title, price, imageUrl, description } = req.body;
    
    title = title.trim();
    price = parseFloat(price);
    imageUrl = imageUrl.trim();
    description = description.trim();

    req.user.createProduct({ title, price, imageUrl, description }).then(() => res.redirect('/admin/products'));
};

module.exports.postEditProduct = (req, res) => {
    let { productId: id, title, imageUrl, price, description } = req.body;
    
    title = title.trim();
    price = parseFloat(price);
    imageUrl = imageUrl.trim();
    description = description.trim();

    req.user.getProducts({ where: { id } }).then(products => {
        if(products.length === 0) {
            return res.status(500).redirect('/admin/products');
        }

        const product = products[0];

        product.title = title;
        product.price = price;
        product.imageUrl = imageUrl;
        product.description = description;

        return product.save();
    }).then(() => res.redirect('/admin/products'));
};

module.exports.postDeleteProduct = (req, res) => {
    req.user.getProducts({ where: { id: req.body.productId } }).then(products => {
        if(products.length === 0) {
            return res.status(500).redirect('/admin/products');
        }

        return products[0].destroy();
    }).then(() => res.redirect('/admin/products'));
};