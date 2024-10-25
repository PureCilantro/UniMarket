module.exports = (res) => {
    return res.status(404).json({ code: 404, message: "URL no encontrada" });
}