function DoseController(healthMonitor, medicinePump, alertService) {

    return {
        checkHealthAndApplyMedicine: checkHealthAndApplyMedicine
    };

    function checkHealthAndApplyMedicine() {

        const pressure = healthMonitor.getSystolicBloodPressure();
        const time = medicinePump.getTimeSinceLastDoseInMinutes();

        
      
        if(time > 30 && pressure < 55) {
            alertService.notifyDoctor(true);
            medicinePump.dose({name: 'RaisePresure', amount: 3})
        } else if(time > 30 && pressure < 60) {
            medicinePump.dose({name: 'RaisePresure', amount: 2})
        } else if (time > 30 && pressure < 90){
            medicinePump.dose({name: 'RaisePresure', amount: 1})
        } else if (time > 30 && pressure >150) {
            medicinePump.dose({name: 'LowerPresure', amount: 1})
        }
        medicinePump.dose(false)
    }

}

module.exports = DoseController;