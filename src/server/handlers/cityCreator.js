
module.exports = async (data, Model) => {
  try {
    const city = await Model.findOne({
      name: data.name,
      country: data.country,
    });

    if (!city) {
      const nCity = new Model(data);
      await nCity.save();
      return { _id: nCity._id, name: nCity.name, country: nCity.country };
    }

    throw new Error('Такой город уже существует');
  } catch (e) {
    return { error: e.message };
  }
};
