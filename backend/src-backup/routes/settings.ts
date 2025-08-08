import { Router } from 'express';
import { Settings } from '../models';

const router = Router();

// Get all settings
router.get('/', async (req, res) => {
  try {
    const settings = await Settings.find();
    const settingsMap: { [key: string]: any } = {};
    
    settings.forEach(setting => {
      settingsMap[setting.key] = setting.value;
    });
    
    res.json(settingsMap);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch settings' });
  }
});

// Get single setting
router.get('/:key', async (req, res) => {
  try {
    const setting = await Settings.findOne({ key: req.params.key });
    
    if (!setting) {
      return res.status(404).json({ error: 'Setting not found' });
    }
    
    res.json({ [setting.key]: setting.value });
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch setting' });
  }
});

// Update setting
router.put('/:key', async (req, res) => {
  try {
    const { value, description } = req.body;
    
    const setting = await Settings.findOneAndUpdate(
      { key: req.params.key },
      { value, description },
      { upsert: true, new: true }
    );
    
    res.json(setting);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update setting' });
  }
});

export { router as settingsRouter };