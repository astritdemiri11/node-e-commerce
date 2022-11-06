// GET Routes
export const getProducts = (req: any, res: any) => {
  req.user.getProducts().then((products: any) => {
    res.render('sequelize/admin/products', { products, pageTitle: 'Products', linkIndex: 5 });
  }).catch(() => {
    res.status(500).render('sequelize/admin/products', { pageTitle: 'Products', linkIndex: 5, products: [] });
  });
};

export const getAddProduct = (_req: Request, res: any) => {
  res.render('sequelize/admin/edit-product', { pageTitle: 'Add Product', linkIndex: 4, editing: false });
};

export const getEditProduct = (req: any, res: any) => {
  const editing = JSON.parse(req.query.edit || false);

  if (!editing) {
    return res.status(400).redirect('/admin/products');
  }

  return req.user.getProducts({ where: { id: req.params.id } }).then((products: any) => {
    if (products.length === 0) {
      return res.status(500).redirect('/admin/products');
    }

    const product = products[0];
    return res.render('sequelize/admin/edit-product', {
      pageTitle: 'Edit Product', linkIndex: 5, editing, product,
    });
  });
};

// POST Routes
export const postAddProduct = (req: any, res: any) => {
  let {
    title, price, imageUrl, description,
  } = req.body;

  title = title.trim();
  price = parseFloat(price);
  imageUrl = imageUrl.trim();
  description = description.trim();

  req.user.createProduct({
    title, price, imageUrl, description,
  }).then(() => res.redirect('/admin/products'));
};

export const postEditProduct = (req: any, res: any) => {
  const { productId: id } = req.body;
  let {
    title, imageUrl, price, description,
  } = req.body;

  title = title.trim();
  price = parseFloat(price);
  imageUrl = imageUrl.trim();
  description = description.trim();

  req.user.getProducts({ where: { id } }).then((products: any) => {
    if (products.length === 0) {
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

export const postDeleteProduct = (req: any, res: any) => {
  req.user.getProducts({ where: { id: req.body.productId } }).then((products: any) => {
    if (products.length === 0) {
      return res.status(500).redirect('/admin/products');
    }

    return products[0].destroy();
  }).then(() => res.redirect('/admin/products'));
};
