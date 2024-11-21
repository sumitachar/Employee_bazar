import mongoose from "mongoose";

const SkillSchema = new mongoose.Schema({
    skillName:{
        type:String,
        required:true
    },
    designationName:{
        type:String,
        required:true
    }

    
})
SkillSchema.index({ skillName: 1, designationName: 1 }, { unique: true });

const Skills = mongoose.models.Skills || mongoose.model('Skills',SkillSchema)
export default Skills;