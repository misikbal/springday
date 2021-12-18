exports.get404page = (req, res) => {
    res.status(404).render("404",{ title: "Page Not Found" });

}

exports.get505page = (req, res) => {
    res.status(500).render("error/500", { title: "Beklenmedik Bir Hata Oluştu" });
}