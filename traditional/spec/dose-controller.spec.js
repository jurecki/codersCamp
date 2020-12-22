const DoseController = require('../src/dose-controller');


describe('Dose Controller', function () {

    beforeEach(function () {
    });

    it('Gdy ciśnienie spadnie poniżej 90, podaj 1 dawkę leku podnoszącego ciśnienie', function () {
        const medicinePump = {
            dose: jest.fn(),
            getTimeSinceLastDoseInMinutes: function () {return 31}
        };
        const healthMonitor = {
            getSystolicBloodPressure: function() {return 89}
        };
        const alertService = {
            notifyDoctor: function () {return false}
        };

        const doseController = DoseController(healthMonitor, medicinePump, alertService);

        doseController.checkHealthAndApplyMedicine();

        expect(medicinePump.dose).toBeCalledWith({name: 'RaisePresure', amount: 1});
    });


    it('Gdy ciśnienie spadnie poniżej 60, podaj 2 dawki leku podnoszącego ciśnienie', function () {
        const medicinePump = {
            dose: jest.fn(),
            getTimeSinceLastDoseInMinutes: function () {return 31}
        };

        const healthMonitor = {
            getSystolicBloodPressure: function() {return 59}
        }

        const alertService = {
            notifyDoctor: function () {return false}
        };

        const doseController = DoseController(healthMonitor, medicinePump, alertService);

        doseController.checkHealthAndApplyMedicine();

        expect(medicinePump.dose).toBeCalledWith({name: 'RaisePresure', amount: 2});

    });

    it('Gdy ciśnienie wzrośnie powyżej 150, podaj lek obniżający ciśnienie.', function () {
        const medicinePump = {
            dose: jest.fn(),
            getTimeSinceLastDoseInMinutes: function () {return 31}
        };

        const healthMonitor = {
            getSystolicBloodPressure: function() {return 151}
        }

        const alertService = {
            notifyDoctor: function () {return false}
        };

        const doseController = DoseController(healthMonitor, medicinePump, alertService);

        doseController.checkHealthAndApplyMedicine();

        expect(medicinePump.dose).toBeCalledWith({name: 'LowerPresure', amount: 1});
    })

    it('Gdy pompa nie zadziała (może się to zdarzyć przy intensywnym ruchu ręką), ponów próbę.', function () {
        const medicinePump = {
            dose: jest.fn().mockImplementationOnce(() => ({error: 'pompa nie zadziała'})).mockImplementationOnce(() => ({name: 'RaisePresure', amount: 1})),
            getTimeSinceLastDoseInMinutes: function () {return 31}
        };

        const healthMonitor = {
            getSystolicBloodPressure: function() {}
        }

        const alertService = {
            notifyDoctor: function () {return false}
        };

        const doseController = DoseController(healthMonitor, medicinePump, alertService);

        console.log('medidcinePump first call', medicinePump.dose())
        console.log('medidcinePump second call', medicinePump.dose())

        expect(medicinePump.dose).toHaveBeenCalledTimes(2);
       
    })  

    it('Nie podawaj leku, jeśli od ostatniej dawki upłynęło 30 minut lub mniej', function () {
        const medicinePump = {
            dose: jest.fn(),
            getTimeSinceLastDoseInMinutes: function () {return 29}
        };

        const healthMonitor = {
            getSystolicBloodPressure: function() {}
        }

        const alertService = {
            notifyDoctor: function () {return false}
        };
    
        const doseController = DoseController(healthMonitor, medicinePump, alertService);

        doseController.checkHealthAndApplyMedicine();
        expect(medicinePump.dose).toBeCalledWith(false);
    })

    it('Gdy ciśnienie spadnie poniżej 55, najpierw wyślij alarm do lekarza, następnie podaj 3 dawki leku podnoszącego ciśnienie.', function () {
        const medicinePump = {
            dose: jest.fn(),
            getTimeSinceLastDoseInMinutes: function () {return 31}
        };

        const healthMonitor = {
            getSystolicBloodPressure: function() {return 54}
        }

        const alertService = {
            notifyDoctor: jest.fn(),
        };

        const doseController = DoseController(healthMonitor, medicinePump, alertService);

        doseController.checkHealthAndApplyMedicine();
        expect(alertService.notifyDoctor).toBeCalledWith(true);
        expect(medicinePump.dose).toBeCalledWith({name: 'RaisePresure', amount: 3});

    });
});
