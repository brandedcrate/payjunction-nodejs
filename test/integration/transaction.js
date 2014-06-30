var PayjunctionClient = require('lib/payjunction'),
    assert = require('assert');

var randomAmount = function(){
  var value = Math.random() * 10000;
  value = Math.round(value);
  value = value / 100;
  value = value + 5;
  return value.toFixed(2);
};

var payjunction = new PayjunctionClient({
  username: 'pj-ql-01',
  password: 'pj-ql-01p',
  appkey: '2489d40d-a74f-474f-9e8e-7b39507f3101',
  endpoint: 'test'
});

var isSuccessfulTransaction = function(it) {
  it('has no errors', function(){
    assert.equal(this.data.errors, undefined);
  });

  it('is approved', function(){
    assert.equal(this.data.response.approved, true);
  });

  it('status is capture', function(){
    assert.equal(this.data.status, 'CAPTURE');
  });
};

var createTransaction = function(done){
  var test = this;
  this.transaction = payjunction.transaction.create({
    achRoutingNumber: 104000016,
    achAccountNumber: 123456789,
    achAccountType: 'CHECKING',
    achType: 'PPD',
    amountBase: randomAmount()
  });

  this.transaction.on('complete', function(data){
    done(data);
  });
};

describe('transactions', function(){
  describe('creates an ACH transaction', function(){
    this.timeout(6000);

    before(function(done){
      var test = this;

      createTransaction(function(data){
        test.data = data;
        done();
      });
    });

    isSuccessfulTransaction(it);
  });

  describe('creates a credit card transaction (keyed)', function(done){
    this.timeout(6000);

    before(function(done){
      var test = this;
      this.transaction = payjunction.transaction.create({
        cardNumber: 4444333322221111,
        cardExpMonth: '01',
        cardExpYear: '18',
        cardCvv: 999,
        amountBase: randomAmount()
      });

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    isSuccessfulTransaction(it);
  });

  describe('creates a credit card transaction (keyed)', function(done){
    this.timeout(6000);

    before(function(done){
      var test = this;
      this.transaction = payjunction.transaction.create({
        cardTrack: '%B4444333322221111^First/Last^1712980100000?;4444333322221111=1712980100000?',
        amountBase: randomAmount()
      });

      this.transaction.on('complete', function(data){
        test.data = data;
        done();
      });
    });

    isSuccessfulTransaction(it);
  });

  describe('void a transaction', function(){
    this.timeout(6000);

    before(function(done){
      var test = this;

      createTransaction(function(data){
        var transaction = payjunction.transaction.update({
          id: data.transactionId,
          status: 'VOID'
        });

        transaction.on('complete', function(data){
          test.data = data;
          done();
        });
      });
    });

    it('has no errors', function(){
      assert.equal(this.data.errors, undefined);
    });

    it('is approved', function(){
      assert.equal(this.data.response.approved, true);
    });

    it('status is void', function(){
      assert.equal(this.data.status, 'VOID');
    });
  });

  describe('add a signature', function(){
    this.timeout(6000);

    before(function(done){
      var test = this;

      createTransaction(function(data){
        var request = payjunction.transaction.addSignature({
          id: data.transactionId,
          signature: '}SCRIPTEL A ST1501-PYJ 01.00.08 #_5,#<5\'#<5z#"5\'#"5=#"6t#"7m#<7/#>8,#:9\'#+a\'#|b\'$Mcz$Mdv$Meo$Me\'$Mfm$Mfq$Mfr$Mfq$Me[$New$Od-$Pc[$Qco$Sbr$Uat$W9t$Z8v$>7z$+6=%M6w%Q6q%T6n%V6o%Y6s%"6\'%_7o%?7,%+8s%{8[%|9z^Maq^Na-^Nbp^Obv^Obx^Oby^Obv^Pbq^Qa/^Rau^Sam^U9-^V9x^Y9v^"9u^>9v^+9x&M9,&Q9=&Uao&Zat&>ay&{a-*Pa/*Ta/*Xa-*<az*?as*|9[(O9w(R8=(U8r(X7,(Z7q("6/(<6z(<6w("6u("6t(Z6t(Y6t(X6v(W6\'(U7m(R7\'(P8u(M9q*|9[*{ay*|a\(Mbt(Pby(Sbz(Wbx("bs(?a[({axAO9\AS9xAV9nAY8-A"8xA_8wA>8yA?8/A?9rA?9/A?awA>boA<b/AZcyAWdsARemAMe/(?fx(Zgo(Tgx(Pg-*|g-*?gz*_gr*"f;*Yfr*Ye\'*Zd\*<dv*?c[*|cz(Pct(Vcr(<cs({cuAQcxAXcyA>czBMcxBTcvBYcrB>cmB|b.CQbvCUbmCXa\'C<aoC?9\'C+9nC|8yDM7\DM7wDM6[DM6xDM6qC|5[C{5/C+5.C:5=C>6qC_6,C<7qC<7.C_8rC_8.C>9sC?9;C+awC{bmDMbzDPcmDScvDVc-DYc[D<doD>dsD:dxD{d-D{d[D|etD{e.D:frD>f-D"gqDWgyDSg;DMhmC>hnCYg\CUg-CQgtCNf;CMfqCMevCNd-CQdoCTc\'CXctC<cpC+cmDPb[DVb[D<b\D|coERcrEXcuE>cyFMc-FSc[FXdqF_dtF+dvGOdvGRdrGVdoGYc;G<cxG?cpG+b.G{btG|a/G|asG|9.G{9rG:8;G>8xGZ8sGW8qGS8qGO8sF:8yF"8[FV9xFRaoFOa/FNbxFMcpFMc.FNdtFQd/FTerFXe\'F<e\F+fqGOfuGTfvGYftG>fpG|e[HPe\'HSeuHWenHZd.H_dwH:dqH|c\IOc;IRc.IVc-IYc.I_c;I:c[I|doJOdrJRdvJUdzJXd/J"enJ_euJ:e\'J|e[KOfrKRfwKUfzKWf,KXf-KWf-KVf,KSf\'KOfzJ:fyJYfxJRfxI+fyIYfzIQfzH+fzHZfxHVfvHSfsHQfqHPfoHPfmHPe[HQe/HRe\'HTewHVerHZenH>d=IMd-ISdzIYdxI?dxJNdxJSdzJWd-J"d=J>eoJ:etJ{ezJ|e/KNe\KOfqKPftKQfvKRfxKSfyKTfxKVfvKWftKWfrKXfq ]'
        });

        request.on('complete', function(data){
          test.data = data;
          done();
        });
      });
    });

    it('signs a transaction', function(){
      assert.equal(this.data.signatureStatus, 'SIGNED');
    });
  });

  describe('read a transaction', function(){
    this.timeout(6000);

    before(function(done){
      var test = this;

      createTransaction(function(data){
        test.transactionId = data.transactionId;
        var request = payjunction.transaction.read({
          id: data.transactionId
        });

        request.on('complete', function(data){
          test.data = data;
          done();
        });
      });
    });

    it('reads a transaction', function(){
      assert.equal(this.data.transactionId, this.transactionId);
    });
  });
});
